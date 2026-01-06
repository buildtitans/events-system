import type { Kysely, Insertable, Selectable } from "kysely";
import type { DB } from "@/src/server/db/types";

type EventRow = Selectable<DB["events"]>
type NewEvent = Insertable<DB["events"]>

function eventsRepo(db: Kysely<DB>) {
    return {
        list(): Promise<EventRow[]> {
            return db
                .selectFrom("events")
                .selectAll()
                .orderBy("created_at", "desc")
                .execute();
        },

        insertMany(rows: NewEvent[]): Promise<EventRow[]> {
            return db
                .insertInto("events")
                .values(rows)
                .returningAll()
                .execute();
        },
    };
}

export { eventsRepo };

