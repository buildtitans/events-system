import { db } from "@/src/server/db";
import type { Insertable } from "kysely";
import type { Categories } from "../../types/db";
import rawCategories from "../data/categories-placeholder.json";

export async function seedCategories(): Promise<Record<string, string>> {

    if (process.env.NODE_ENV === 'production') {
        throw new Error('Seeding disabled in production');
    }

    const categoryBySlug: Record<string, string> = {};


    for (const category of rawCategories) {

        const row: Insertable<Categories> = {
            name: category.name,
            icon: category.icon,
            slug: category.slug
        }

        const inserted = await db
            .insertInto("categories")
            .values(row)
            .onConflict(
                (conflict) =>
                    conflict
                        .column("slug")
                        .doNothing()
            )
            .returning(["id", "slug"])
            .execute()

        if (inserted.length > 0) {
            const { id, slug } = inserted[0];
            categoryBySlug[slug] = id;
        } else {
            const existing = await db
                .selectFrom("categories")
                .select(["id", "slug"])
                .where("slug", "=", row.slug)
                .executeTakeFirstOrThrow()

            categoryBySlug[existing.slug] = existing.id;
        }
    }

    console.log(`Seeded ${rawCategories.length} events from placeholder-events.json`);


    return categoryBySlug;

}

seedCategories()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Seeding failed on table 'categories'", err);
        process.exit(1);
    });