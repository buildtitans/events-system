import { db } from "../index";
import type { Insertable } from "kysely";
import type { Events } from "../types";
import rawEvents from "@/src/server/data/placeholder-events.json";

async function seedEvents() {

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
        };

        await db
            .insertInto("events")
            .values(row)
            .onConflict((conflict) => conflict.column("id").doNothing())
            .execute();
    }

    console.log(`Seeded ${rawEvents.length} events from placeholder-events.json`);
}

seedEvents()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Seeding failed", err);
        process.exit(1);
    });

