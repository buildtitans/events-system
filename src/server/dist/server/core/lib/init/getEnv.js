"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
let loaded = false;
function ensureEnvLoaded() {
    if (loaded)
        return;
    (0, dotenv_1.config)({ path: path_1.default.resolve(process.cwd(), ".env") });
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
};
function getEnv(key) {
    ensureEnvLoaded();
    const envName = ENV_MAP[key];
    const value = process.env[envName];
    if (!value) {
        throw new Error(`Missing env var ${envName} for key ${key}`);
    }
    return value;
}
//# sourceMappingURL=getEnv.js.map