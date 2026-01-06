import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./types";

const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: "postgres://events_user:events_password@localhost:5433/events_db"
        })
    })
});

export { db };

