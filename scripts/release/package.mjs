#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createTarball, extractTarball } from "../helpers/archive.mjs";
import {
  createArtifactDescriptor,
  getSourceDateEpoch,
  writeGitHubOutputs,
} from "../helpers/artifactMetadata.mjs";
import { assertInside, stageReleaseFiles } from "../helpers/fileStaging.mjs";
import { validateRelease } from "./validate.mjs";

const APP_NAME = "events-system";
const RELEASE_PREFIX = "events-system/releases";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const deployRoot = path.join(repoRoot, ".deploy");
const stagingRoot = path.join(deployRoot, "staging");
const serverRuntimeRoot = path.join(deployRoot, "server-runtime");
const extractionRoot = path.join(deployRoot, "extracted");
const artifactsRoot = path.join(deployRoot, "artifacts");
const metadataPath = path.join(deployRoot, "release-metadata.json");

function assertTargetRuntime() {
  const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);

  if (
    process.platform !== "linux" ||
    process.arch !== "x64" ||
    nodeMajor !== 24
  ) {
    throw new Error(
      `Release packaging requires Linux/x64/Node 24; received ${process.platform}/${process.arch}/Node ${nodeMajor}`,
    );
  }
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    child.on("error", (error) => {
      reject(new Error(`Unable to run ${command}: ${error.message}`));
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function removeBinDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name === ".bin") {
      await rm(fullPath, { recursive: true, force: true });
      continue;
    }
    if (entry.isDirectory()) {
      await removeBinDirectories(fullPath);
    }
  }
}

async function prepareServerRuntime() {
  assertInside(deployRoot, serverRuntimeRoot);
  await rm(serverRuntimeRoot, { recursive: true, force: true });
  await mkdir(serverRuntimeRoot, { recursive: true });

  await run(
    "pnpm",
    [
      "--config.node-linker=hoisted",
      "--config.package-import-method=copy",
      "--filter",
      "events-system-server",
      "--prod",
      "deploy",
      serverRuntimeRoot,
    ],
    {
      cwd: repoRoot,
      env: process.env,
      stdio: "inherit",
    },
  );

  await removeBinDirectories(path.join(serverRuntimeRoot, "node_modules"));
}

async function main() {
  assertTargetRuntime();

  const artifact = createArtifactDescriptor({
    appName: APP_NAME,
    releasePrefix: RELEASE_PREFIX,
    repoRoot,
    artifactsRoot,
    argv: process.argv,
    env: process.env,
  });
  const sourceDateEpoch = getSourceDateEpoch({
    repoRoot,
    env: process.env,
  });

  assertInside(deployRoot, artifact.artifactPath);

  await prepareServerRuntime();
  await stageReleaseFiles({
    repoRoot,
    deployRoot,
    stagingRoot,
    serverRuntimeRoot,
  });
  await validateRelease(stagingRoot);
  await mkdir(artifactsRoot, { recursive: true });
  await rm(artifact.artifactPath, { force: true });
  await createTarball({
    repoRoot,
    stagingRoot,
    artifactPath: artifact.artifactPath,
    sourceDateEpoch,
  });
  await extractTarball({
    repoRoot,
    artifactPath: artifact.artifactPath,
    extractionRoot,
  });
  await validateRelease(extractionRoot);

  const artifactStats = await stat(artifact.artifactPath);
  const metadata = {
    ...artifact,
    stagingPath: stagingRoot,
    extractedPath: extractionRoot,
    sizeBytes: artifactStats.size,
    createdAt: new Date().toISOString(),
    sourceDateEpoch,
  };

  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  await writeGitHubOutputs(metadata, process.env);

  console.log(`Created ${path.relative(repoRoot, artifact.artifactPath)}`);
  console.log(`Artifact key: ${metadata.artifactKey}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
