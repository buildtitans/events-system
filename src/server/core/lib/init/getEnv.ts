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
  dev_client_url: "DEV_CLIENT_URL",
  client_url: "CLIENT_URL",
  dev_host: "DEV_FASTIFY_HOST",
  dev_fastify_port: "DEV_FASTIFY_PORT",
  prodFastifyHost: "PROD_FASTIFY_HOST",
  prodFastifyPort: "PROD_FASTIFY_PORT",
  devPwResetUrl: "DEV_PW_RESET_URL",
  pwResetUrl: "PW_RESET_URL",
  resendProdKey: "RESEND_API_KEY",
  resendDevKey: "RESEND_DEV_API_KEY",
  geoApifyKey: "GEOAPIFY_API_KEY",
  geoApifyUrl: "GEOAPIFY_REQ_BASE_URL",
} as const;

export type EnvKey = keyof typeof ENV_MAP;

export function getEnv(key: EnvKey): string {
  ensureEnvLoaded();

  const envName = ENV_MAP[key];
  const value = process.env[envName];

  if (!value) {
    throw new Error(`Missing env var ${envName} for key ${key}`);
  }

  return value;
}
