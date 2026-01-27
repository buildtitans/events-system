import { db } from "@/src/server/db";
import type { Insertable } from "kysely";
import type { Groups } from "../../types/db";
import rawGroups from "@/src/server/db/seeds/data/placeholder-groups.json";
import slugify from "slugify";

export async function seedGroups(
    categoryBySlug: Record<string, string>,
    usersByEmail: Record<string, string>
): Promise<Record<string, string>> {

    const groupBySlug: Record<string, string> = {};

    for (const group of rawGroups) {
        const nameAndLocation = `${group.name} ${group.location}`

        const slug = slugify(nameAndLocation, {
            replacement: "-",
            lower: true,
            trim: true
        })

        const categorySlug = group.category.trim().toLowerCase();

        const categoryId = categoryBySlug[categorySlug];

        const row: Insertable<Groups> = {
            name: group.name,
            description: group.description,
            location: group.location,
            slug: slug,
            category_id: categoryId,
            organizer_email: group.organizer_email
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

    console.log({
        Slugs: groupBySlug
    });

    return groupBySlug;
}
