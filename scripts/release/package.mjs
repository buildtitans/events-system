#!/usr/bin/env node

import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createTarball } from "../helpers/archive.mjs";
import {
  createArtifactDescriptor,
  writeGitHubOutputs,
} from "../helpers/artifactMetadata.mjs";
import { assertInside, stageReleaseFiles } from "../helpers/fileStaging.mjs";

const APP_NAME = "events-system";
const RELEASE_PREFIX = "events-system/releases";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const deployRoot = path.join(repoRoot, ".deploy");
const stagingRoot = path.join(deployRoot, "staging");
const artifactsRoot = path.join(deployRoot, "artifacts");
const metadataPath = path.join(deployRoot, "release-metadata.json");

async function main() {
  const artifact = createArtifactDescriptor({
    appName: APP_NAME,
    releasePrefix: RELEASE_PREFIX,
    repoRoot,
    artifactsRoot,
    argv: process.argv,
    env: process.env,
  });

  assertInside(deployRoot, artifact.artifactPath);

  await stageReleaseFiles({
    repoRoot,
    deployRoot,
    stagingRoot,
  });
  await mkdir(artifactsRoot, { recursive: true });
  await rm(artifact.artifactPath, { force: true });
  await createTarball({
    repoRoot,
    stagingRoot,
    artifactPath: artifact.artifactPath,
  });

  const artifactStats = await stat(artifact.artifactPath);
  const metadata = {
    ...artifact,
    stagingPath: stagingRoot,
    sizeBytes: artifactStats.size,
    createdAt: new Date().toISOString(),
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
