import { copyFile, cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const dereferenceSymlinks = process.platform === "win32";

export function isInside(parent, target) {
  const relative = path.relative(parent, target);
  return (
    relative === "" ||
    (!!relative && !relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

export function assertInside(parent, target) {
  if (!isInside(parent, target)) {
    throw new Error(`Refusing to write outside ${parent}: ${target}`);
  }
}

function requirePath(repoRoot, relativePath) {
  const fullPath = path.join(repoRoot, relativePath);

  if (!existsSync(fullPath)) {
    throw new Error(`Missing required release input: ${relativePath}`);
  }

  return fullPath;
}

async function resetDirectory({ deployRoot, target }) {
  assertInside(deployRoot, target);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
}

async function copyRequiredFile({
  repoRoot,
  stagingRoot,
  relativePath,
  destinationRelativePath = relativePath,
}) {
  const source = requirePath(repoRoot, relativePath);
  const destination = path.join(stagingRoot, destinationRelativePath);

  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

function isEnvFile(filePath) {
  const basename = path.basename(filePath);
  return basename === ".env" || basename.startsWith(".env.");
}

async function copyRequiredDirectory({
  repoRoot,
  stagingRoot,
  sourceRelativePath,
  destinationRelativePath,
  excludeEnvFiles = false,
}) {
  const source = requirePath(repoRoot, sourceRelativePath);
  const destination = path.join(stagingRoot, destinationRelativePath);

  await cp(source, destination, {
    recursive: true,
    dereference: dereferenceSymlinks,
    force: true,
    filter: (sourcePath) => {
      if (excludeEnvFiles && isEnvFile(sourcePath)) {
        return false;
      }

      return true;
    },
  });
}

async function findEnvFiles({ stagingRoot, directory }) {
  const entries = await readdir(directory, { withFileTypes: true });
  const matches = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (isEnvFile(fullPath)) {
      matches.push(path.relative(stagingRoot, fullPath));
      continue;
    }

    if (entry.isDirectory()) {
      matches.push(...(await findEnvFiles({ stagingRoot, directory: fullPath })));
    }
  }

  return matches;
}

export async function stageReleaseFiles({ repoRoot, deployRoot, stagingRoot }) {
  requirePath(repoRoot, ".next/standalone/server.js");
  requirePath(repoRoot, ".next/static");
  requirePath(repoRoot, "public");
  requirePath(repoRoot, "src/server/dist/src/server/index.js");

  await resetDirectory({ deployRoot, target: stagingRoot });

  await copyRequiredFile({ repoRoot, stagingRoot, relativePath: "package.json" });
  await copyRequiredFile({ repoRoot, stagingRoot, relativePath: "pnpm-lock.yaml" });
  await copyRequiredFile({
    repoRoot,
    stagingRoot,
    relativePath: "pnpm-workspace.yaml",
  });
  await copyRequiredFile({ repoRoot, stagingRoot, relativePath: "next.config.ts" });

  await copyRequiredDirectory({
    repoRoot,
    stagingRoot,
    sourceRelativePath: ".next/standalone",
    destinationRelativePath: "next-standalone",
    excludeEnvFiles: true,
  });
  await copyRequiredDirectory({
    repoRoot,
    stagingRoot,
    sourceRelativePath: ".next/static",
    destinationRelativePath: "next-standalone/.next/static",
  });
  await copyRequiredDirectory({
    repoRoot,
    stagingRoot,
    sourceRelativePath: "public",
    destinationRelativePath: "next-standalone/public",
  });

  await copyRequiredFile({
    repoRoot,
    stagingRoot,
    relativePath: "src/server/package.json",
  });
  await copyRequiredDirectory({
    repoRoot,
    stagingRoot,
    sourceRelativePath: "src/server/dist",
    destinationRelativePath: "src/server/dist",
  });

  const leakedEnvFiles = await findEnvFiles({
    stagingRoot,
    directory: stagingRoot,
  });
  if (leakedEnvFiles.length > 0) {
    throw new Error(
      `Release staging contains env files: ${leakedEnvFiles.join(", ")}`,
    );
  }
}
