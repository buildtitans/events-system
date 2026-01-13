import path from "path";
import { config } from "dotenv";

let loaded = false;

function ensureEnvLoaded() {
    if (loaded) return;

    config({ path: path.resolve(process.cwd(), ".env") });
    loaded = true;
}

const ENV_MAP = {
    dbPassword: "POSTGRES_PASSWORD",
    fastifyUrl: "FASTIFY_SERVER_URL",
    port: "FASTIFY_SERVER_PORT",
    events_endpoint: "GET_EVENTS_ENDPOINT",
    groups_endpoint: "GET_GROUPS_ENDPOINT",
    pghost: "PGHOST",
    dbPort: "PGPORT",
    postgresDb: "PGDATABASE",
    db_user: "PGUSER"
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


//
//const envVars = {
//    dbPassword: process.env.POSTGRES_PASSWORD,
//    fastifyUrl: process.env.FASTIFY_SERVER_URL,
//    port: process.env.FASTIFY_SERVER_PORT,
//    events_endpoint: process.env.GET_EVENTS_ENDPOINT,
//    groups_endpoint: process.env.GET_GROUPS_ENDPOINT,
//    pghost: process.env.PGHOST,
//    dbPort: process.env.PGPORT,
//    postgresDb: process.env.PGDATABASE,
//    db_user: process.env.PGUSER
//}
//
//
//function getEnv(varName: keyof typeof envVars): string {
//
//    if (typeof envVars[varName] === "undefined") {
//        console.error(`${varName} is not available`);
//        process.exit(1);
//    } else {
//        return envVars[varName] as string
//    }
//}
//
//export { getEnv };