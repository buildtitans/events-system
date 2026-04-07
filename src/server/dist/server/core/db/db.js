"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: path_1.default.resolve(process.cwd(), ".env") });
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const pgPort = Number(process.env.PGPORT);
const pgMax = Number(process.env.PGMAX);
const dialect = new kysely_1.PostgresDialect({
    pool: new pg_1.Pool({
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: pgPort,
        max: pgMax,
    }),
});
const db = new kysely_1.Kysely({
    dialect,
});
exports.db = db;
//# sourceMappingURL=db.js.map