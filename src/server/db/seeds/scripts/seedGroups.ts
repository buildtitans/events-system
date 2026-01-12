import { db } from "@/src/server/db";
import type { Insertable } from "kysely";
import type { Groups } from "../../types/db";
import rawGroups from "@/src/server/db/seeds/data/placeholder-groups.json";

export async function seedGroups(
    categoryBySlug: Record<string, string>
): Promise<Record<string, string>> {

    const groupBySlug: Record<string, string> = {};

    for (const group of rawGroups) {
        const slug = `${group.name}-${group.location}`.toLowerCase().replace(/\s+/g, "-");

        const row: Insertable<Groups> = {
            name: group.name,
            description: group.description,
            location: group.location,
            slug,
            category_id: categoryBySlug[group.category],
        };

        const inserted = await db
            .insertInto("groups")
            .values(row)
            .onConflict((c) => c.column("slug").doNothing())
            .returning(["id", "slug"])
            .execute();

        if (inserted.length > 0) {
            groupBySlug[inserted[0].slug] = inserted[0].id;
        } else {
            const existing = await db
                .selectFrom("groups")
                .select(["id", "slug"])
                .where("slug", "=", slug)
                .executeTakeFirstOrThrow();

            groupBySlug[existing.slug] = existing.id;
        }
    }

    console.log(`Seeded ${rawGroups.length} groups`);
    return groupBySlug;
}
