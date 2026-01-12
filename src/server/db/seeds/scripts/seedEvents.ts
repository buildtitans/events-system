import { db } from "@/src/server/db/db";
import type { Insertable } from "kysely";
import type { Events } from "@/src/server/db/types/db";
import rawEvents from "@/src/server/db/seeds/data/placeholder-events.json";

export async function seedEvents(groupsBySlug: Record<string, string>) {

    if (process.env.NODE_ENV === 'production') {
        throw new Error('Seeding disabled in production');
    }

    for (const event of rawEvents) {
        const row: Insertable<Events> = {
            title: event.title,
            description: event.description,
            tag: event.tag,
            img: event.img ?? null,
            authors: JSON.stringify(event.authors),
            group_id: groupsBySlug[event.group]
        };

        await db
            .insertInto("events")
            .values(row)
            .onConflict((conflict) => conflict.column("id").doNothing())
            .execute();
    }

    console.log(`Seeded ${rawEvents.length} events from placeholder-events.json`);
}

