import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "@/src/server/core/db/types/db";

const pgPort = Number(process.env.PGPORT);

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: pgPort,
    max: 10,
  }),
});

const db = new Kysely<DB>({
  dialect,
});

export { db };
