import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "@/src/server/db/types/db";



const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: "postgres://events_user:eventspassword@postgres:5432/events_db"
        })
    })
});

export { db };