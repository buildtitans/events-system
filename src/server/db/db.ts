import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "@/src/server/db/types/db";


const dialect = new PostgresDialect({
    pool: new Pool({
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: 5433,
        max: 10
    })
});

const db = new Kysely<DB>({
    dialect,
})

export { db };