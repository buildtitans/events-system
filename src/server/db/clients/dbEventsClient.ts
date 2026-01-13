import { Kysely } from "kysely";
import { DB } from "../types/db";


export class EventsClient {
    constructor(private readonly db: Kysely<DB>) {
        this.db = db;
    }


    async getEvents() {
        return this.db
            .selectFrom("events")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();
    }
}