import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "@/src/server/db/types/types";


const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.CONTAINER_DB_URL
        })
    })
});

export { db };