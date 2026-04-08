import path from "path";
import { config } from "dotenv";

let loaded = false;

function ensureEnvLoaded() {
  if (loaded) return;

  config({ path: path.resolve(process.cwd(), ".env") });
  loaded = true;
}

const ENV_MAP = {
  dbPassword: "PGPASSWORD",
  fastifyUrl: "NEXT_PUBLIC_FASTIFY_SERVER_URL",
  port: "FASTIFY_SERVER_PORT",
  pghost: "PGHOST",
  dbPort: "PGPORT",
  postgresDb: "PGDATABASE",
  db_user: "PGUSER",
  cookies_secret: "COOKIES_SECRET",
  client_url: "CLIENT_URL",
  dev_host: "DEV_FASTIFY_HOST",
  dev_fastify_port: "DEV_FASTIFY_PORT",
  prodFastifyHost: "PROD_FASTIFY_HOST",
  prodFastifyPort: "3001",
} as const;

type EnvKey = keyof typeof ENV_MAP;

export function getEnv(key: EnvKey): string {
  ensureEnvLoaded();

  const envName = ENV_MAP[key];
  const value = process.env[envName];

  if (!value) {
    throw new Error(`Missing env var ${envName} for key ${key}`);
  }

  return value;
}
