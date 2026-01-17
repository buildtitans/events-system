import { Kysely, Selectable } from "kysely";
import { DB } from "../types/db";
import type { Events } from "../types/db";
import { compileEventsLayout } from "../../layout/compileEventsLayout";

export class EventsClient {
    constructor(private readonly db: Kysely<DB>) {
        this.db = db;
    }


    async getEvents() {
        const raw = await this.getRawEvents();
        const layout = compileEventsLayout(raw);
        return layout;
    }

    async getRawEvents(): Promise<Selectable<Events>[]> {
        return this.db
            .selectFrom("events")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();

    }

}