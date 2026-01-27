import { db } from "@/src/server/db/db";
import type { Insertable } from "kysely";
import type { Events } from "@/src/server/db/types/db";
import rawEvents from "@/src/server/db/seeds/data/placeholder-events.json";

export async function seedEvents(groupsBySlug: Record<string, string>) {

    if (process.env.NODE_ENV === 'production') {
        throw new Error('Seeding disabled in production');
    }

    for (const event of rawEvents) {
        const groupID = groupsBySlug[event.group];
        console.log(groupID);

        const row: Insertable<Events> = {
            title: event.title,
            description: event.description,
            tag: event.tag,
            img: event.img ?? null,
            authors: JSON.stringify(event.authors),
            group_id: groupID,
            starts_at: event.starts_at
        };
        const inserted = await db
            .insertInto("events")
            .values(row)
            .onConflict(c =>
                c.columns(["group_id", "starts_at"]).doUpdateSet({
                    title: row.title,
                    description: row.description,
                    tag: row.tag,
                    img: row.img,
                    authors: row.authors,
                })
            )

            .returning("id")
            .execute();

        if (inserted.length === 0) {
            throw new Error(`Event insert failed: ${event.title}`);
        }
    }

    console.log(`Seeded ${rawEvents.length} events from placeholder-events.json`);
}

