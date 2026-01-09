import { db } from "@/src/server/db";
import type { Insertable } from "kysely";
import type { Groups } from "../../types/db";
import rawGroups from "@/src/server/db/seeds/data/placeholder-groups.json";

async function seedGroups() {

    for (const group of rawGroups) {
        const row: Insertable<Groups> = {
            name: group.name,
            description: group.description,
            location: group.location,
            category_id: null,
            updated_at: new Date(),
            created_at: new Date(),
            slug: "",
        }

        await db
            .insertInto("groups")
            .values(row)
            .onConflict((conflict) => conflict.column("id").doNothing())
            .execute()
    }
}

seedGroups()
    .then(() =>
        process.exit()
    )
    .catch((err) =>
        console.error("seed failed", err)
    );