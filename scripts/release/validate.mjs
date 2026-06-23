#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  lstat,
  readFile,
  readdir,
  realpath,
  stat,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_MANIFEST = {
  schemaVersion: 1,
  appName: "events-system",
  runtime: {
    platform: "linux",
    architecture: "x64",
    nodeMajorVersion: 24,
  },
};

const LAUNCHERS = [
  "bin/start-next",
  "bin/start-fastify",
  "bin/db-migrate",
  "bin/db-seed",
];

const ENTRY_POINTS = [
  "next-standalone/server.js",
  "src/server/dist/src/server/index.js",
  "src/server/dist/src/server/core/db/migrations/migrate.js",
  "src/server/dist/src/server/core/db/seeds/scripts/seedDB.js",
];

const REQUIRED_FILES = [
  "next-standalone/node_modules/@next/env/package.json",
];

const REQUIRED_DIRECTORIES = [
  "next-standalone/.next/static",
  "next-standalone/public",
  "src/server/node_modules",
];

const PACKAGE_MANAGER_PATTERN = /\b(?:npm|pnpm|yarn|npx)\b/i;
const SECRET_FILE_PATTERNS = [
  /^\.env(?:\.|$)/i,
  /^credentials(?:\.json)?$/i,
  /^service-account(?:\.json)?$/i,
  /^id_(?:rsa|dsa|ecdsa|ed25519)$/i,
  /\.(?:pem|key|p12|pfx)$/i,
];
const SECRET_CONTENT_PATTERNS = [
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bghp_[A-Za-z0-9]{36}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
];
const PRIVATE_KEY_BLOCK_PATTERN =
  /-----BEGIN ((?:RSA |DSA |EC |OPENSSH )?PRIVATE KEY)-----([\s\S]*?)-----END \1-----/g;

async function requireRegularFile(root, relativePath, executable = false) {
  const fullPath = path.join(root, relativePath);
  const fileStats = await lstat(fullPath).catch(() => undefined);

  if (!fileStats?.isFile() || fileStats.isSymbolicLink()) {
    throw new Error(`Required regular file is missing: ${relativePath}`);
  }

  if (executable && (fileStats.mode & 0o111) === 0) {
    throw new Error(`Required launcher is not executable: ${relativePath}`);
  }

  return fullPath;
}

async function requireDirectory(root, relativePath) {
  const directoryStats = await lstat(path.join(root, relativePath)).catch(
    () => undefined,
  );

  if (!directoryStats?.isDirectory() || directoryStats.isSymbolicLink()) {
    throw new Error(`Required directory is missing: ${relativePath}`);
  }
}

async function walk(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.relative(root, fullPath);
    const entryStats = await lstat(fullPath);

    if (entryStats.isSymbolicLink()) {
      throw new Error(`Release contains a symlink: ${relativePath}`);
    }

    if (entryStats.isDirectory()) {
      files.push(...(await walk(root, fullPath)));
      continue;
    }

    if (!entryStats.isFile()) {
      throw new Error(`Release contains a special file: ${relativePath}`);
    }

    files.push({ fullPath, relativePath });
  }

  return files;
}

function isSecretFile(relativePath) {
  const segments = relativePath.split(path.sep);
  return segments.some((segment) =>
    SECRET_FILE_PATTERNS.some((pattern) => pattern.test(segment)),
  );
}

function isInfrastructureConfig(relativePath) {
  const normalized = relativePath.split(path.sep).join("/").toLowerCase();
  const basename = path.posix.basename(normalized);

  return (
    normalized.startsWith("etc/systemd/") ||
    normalized.startsWith("etc/nginx/") ||
    normalized.includes("/systemd/system/") ||
    basename === "nginx.conf" ||
    basename.endsWith(".service")
  );
}

async function scanFileContents(files) {
  for (const { fullPath, relativePath } of files) {
    const fileStats = await stat(fullPath);
    if (fileStats.size > 2 * 1024 * 1024) continue;

    const contents = await readFile(fullPath);
    if (contents.includes(0)) continue;

    const text = contents.toString("utf8");
    PRIVATE_KEY_BLOCK_PATTERN.lastIndex = 0;
    for (const match of text.matchAll(PRIVATE_KEY_BLOCK_PATTERN)) {
      const compactBody = match[2].replace(/\s/g, "");
      if (
        compactBody.length >= 128 &&
        /^[A-Za-z0-9+/=]+$/.test(compactBody)
      ) {
        throw new Error(`Release contains private key material: ${relativePath}`);
      }
    }

    const matchedPattern = SECRET_CONTENT_PATTERNS.find((pattern) =>
      pattern.test(text),
    );

    if (matchedPattern) {
      throw new Error(`Release contains secret-like content: ${relativePath}`);
    }
  }
}

function assertTargetRuntime() {
  const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);

  if (
    process.platform !== "linux" ||
    process.arch !== "x64" ||
    nodeMajor !== 24
  ) {
    throw new Error(
      `Release validation requires Linux/x64/Node 24; received ${process.platform}/${process.arch}/Node ${nodeMajor}`,
    );
  }
}

function checkJavaScriptSyntax(filePath, relativePath) {
  const result = spawnSync(process.execPath, ["--check", filePath], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(
      `JavaScript syntax check failed for ${relativePath}: ${result.stderr}`,
    );
  }
}

async function validateManifest(root) {
  const manifestPath = await requireRegularFile(
    root,
    ".bt-infra-release.json",
  );
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (JSON.stringify(manifest) !== JSON.stringify(EXPECTED_MANIFEST)) {
    throw new Error("Release manifest does not match the BT-Infra contract");
  }
}

async function validateLaunchers(root, options = {}) {
  for (const relativePath of LAUNCHERS) {
    const launcherPath = await requireRegularFile(
      root,
      relativePath,
      options.requireExecutable !== false,
    );
    const contents = await readFile(launcherPath, "utf8");

    if (!contents.startsWith("#!/usr/bin/env bash\nset -euo pipefail\n")) {
      throw new Error(`Launcher is missing its defensive preamble: ${relativePath}`);
    }

    if (!contents.includes("exec /usr/bin/node ")) {
      throw new Error(`Launcher does not exec /usr/bin/node: ${relativePath}`);
    }

    if (PACKAGE_MANAGER_PATTERN.test(contents)) {
      throw new Error(`Launcher invokes a package manager: ${relativePath}`);
    }
  }
}

async function validateDependencies(root) {
  const fastifyEntry = path.join(
    root,
    "src/server/dist/src/server/index.js",
  );
  const packagePath = path.join(root, "src/server/package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  const requireFromFastify = createRequire(fastifyEntry);

  for (const dependency of Object.keys(packageJson.dependencies ?? {})) {
    try {
      requireFromFastify.resolve(dependency);
    } catch (error) {
      throw new Error(
        `Fastify cannot resolve production dependency ${dependency}: ${error.message}`,
      );
    }
  }

  const fastify = requireFromFastify("fastify");
  if (typeof fastify !== "function") {
    throw new Error("fastify loaded without its expected runtime API");
  }

  const kysely = requireFromFastify("kysely");
  if (
    typeof kysely.Kysely !== "function" ||
    typeof kysely.PostgresDialect !== "function"
  ) {
    throw new Error("kysely loaded without its expected runtime API");
  }

  const kyselyMigration = requireFromFastify("kysely/migration");
  if (
    typeof kyselyMigration.Migrator !== "function" ||
    typeof kyselyMigration.FileMigrationProvider !== "function"
  ) {
    throw new Error("kysely/migration loaded without its expected runtime API");
  }

  const argon2 = requireFromFastify("argon2");
  if (typeof argon2.hash !== "function" || typeof argon2.verify !== "function") {
    throw new Error("argon2 loaded without its expected native API");
  }
}

export async function validateRelease(root, options = {}) {
  const requireTargetRuntime = options.requireTargetRuntime !== false;
  if (requireTargetRuntime) {
    assertTargetRuntime();
  }

  const resolvedRoot = await realpath(root);
  await validateManifest(resolvedRoot);
  await validateLaunchers(resolvedRoot, {
    requireExecutable: requireTargetRuntime,
  });

  for (const relativePath of ENTRY_POINTS) {
    const entryPath = await requireRegularFile(resolvedRoot, relativePath);
    checkJavaScriptSyntax(entryPath, relativePath);
  }

  for (const relativePath of REQUIRED_FILES) {
    await requireRegularFile(resolvedRoot, relativePath);
  }

  await requireRegularFile(resolvedRoot, "src/server/package.json");
  for (const relativePath of REQUIRED_DIRECTORIES) {
    await requireDirectory(resolvedRoot, relativePath);
  }

  const files = await walk(resolvedRoot);
  for (const { relativePath } of files) {
    if (isSecretFile(relativePath)) {
      throw new Error(`Release contains a secret file: ${relativePath}`);
    }
    if (isInfrastructureConfig(relativePath)) {
      throw new Error(
        `Release contains infrastructure configuration: ${relativePath}`,
      );
    }
  }

  await scanFileContents(files);
  await validateDependencies(resolvedRoot);
  console.log(`Validated release artifact at ${resolvedRoot}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const root = process.argv[2];
  if (!root) {
    console.error("Usage: node scripts/release/validate.mjs RELEASE_ROOT");
    process.exit(64);
  }

  validateRelease(path.resolve(root)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
