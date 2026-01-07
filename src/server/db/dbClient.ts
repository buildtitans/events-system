import type { DB } from "./types";
import type { Kysely } from "kysely";

export class DBClient {

    constructor(private db: Kysely<DB>) {
        this.db = db
    }

    getEvents() {
        return this.db
            .selectFrom("events")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();

    }
};