import { spawn } from "node:child_process";

export async function createTarball({ repoRoot, stagingRoot, artifactPath }) {
  await new Promise((resolve, reject) => {
    const tar = spawn("tar", ["-czf", artifactPath, "-C", stagingRoot, "."], {
      cwd: repoRoot,
      stdio: "inherit",
    });

    tar.on("error", (error) => {
      reject(
        new Error(
          `Unable to run tar. Ensure tar is available on PATH. ${error.message}`,
        ),
      );
    });
    tar.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`tar exited with code ${code}`));
    });
  });
}
