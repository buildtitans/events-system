import { db } from "../index";
import { sql, type Insertable } from "kysely";
import type { Events } from "../types";
import { cardData } from "@/src/lib/tokens/cardTokens";

async function seedEvents() {
    console.log("🌱 Seeding events...");

    for (const event of cardData) {
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

    console.log(`✅ Seeded ${cardData.length} events`);
}

seedEvents()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Seeding failed", err);
        process.exit(1);
    });

