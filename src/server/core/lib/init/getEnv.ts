import path from "path";
import { config } from "dotenv";
import { ENV_MAP } from "./envMap";
import type { EnvKey } from "./envMap";

let loaded = false;

function ensureEnvLoaded() {
  if (loaded) return;

  config({ path: path.resolve(process.cwd(), ".env") });
  loaded = true;
}

export function getEnv(key: EnvKey): string {
  ensureEnvLoaded();

  const envName = ENV_MAP[key];
  const value = process.env[envName];

  if (!value) {
    throw new Error(`Missing env var ${envName} for key ${key}`);
  }

  return value;
}
