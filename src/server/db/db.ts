import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "@/src/server/db/types/db";

console.log("POSTGRES_PASSWORD =", JSON.stringify(process.env.POSTGRES_PASSWORD));


const dialect = new PostgresDialect({
    pool: new Pool({
        database: "events_db",
        host: "localhost",
        user: "events_user",
        password: "eventspassword",
        port: 5433,
        max: 10
    })
});

const db = new Kysely<DB>({
    dialect,
})

export { db };