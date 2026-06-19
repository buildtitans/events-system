import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";

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

export async function createTarball({
  repoRoot,
  stagingRoot,
  artifactPath,
  sourceDateEpoch,
}) {
  await run(
    "tar",
    [
      "--sort=name",
      `--mtime=@${sourceDateEpoch}`,
      "--owner=0",
      "--group=0",
      "--numeric-owner",
      "-czf",
      artifactPath,
      "-C",
      stagingRoot,
      ".",
    ],
    {
      cwd: repoRoot,
      stdio: "inherit",
    },
  );
}

export async function extractTarball({
  repoRoot,
  artifactPath,
  extractionRoot,
}) {
  await rm(extractionRoot, { recursive: true, force: true });
  await mkdir(extractionRoot, { recursive: true });

  await run("tar", ["-xzf", artifactPath, "-C", extractionRoot], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}
