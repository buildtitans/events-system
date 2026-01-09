import { getEnv } from "@/src/lib/utils/getEnv";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "@/src/server/db/types/db";

const password = getEnv("dbPassword");

console.log(`************DB_PASSWORD:${password}***********`)

const dialect = new PostgresDialect({
    pool: new Pool({
        database: "events_db",
        host: "localhost",
        user: "events_user",
        password: password,
        port: 5433,
        max: 10
    })
});

const db = new Kysely<DB>({
    dialect,
})

export { db };