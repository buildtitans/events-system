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
    fastifyUrl: "FASTIFY_SERVER_URL",
    port: "FASTIFY_SERVER_PORT",
    events_endpoint: "GET_EVENTS_ENDPOINT",
    groups_endpoint: "GET_GROUPS_ENDPOINT",
    pghost: "PGHOST",
    dbPort: "PGPORT",
    postgresDb: "PGDATABASE",
    db_user: "PGUSER",
    cookies_secret: "COOKIES_SECRET"
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