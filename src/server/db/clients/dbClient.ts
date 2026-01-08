import type { DB } from "@/src/server/db/types/types";
import type { Kysely } from "kysely";

export class DBClient {

    constructor(private db: Kysely<DB>) {
        this.db = db
    }

    async getEvents() {
        const rows = this.db
            .selectFrom("events")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();

        const events = (await rows).map((row) => ({
            ...row,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString()
        }))

        console.log(rows)

        return events;
    }
};