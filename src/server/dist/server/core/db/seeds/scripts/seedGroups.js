"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedGroups = seedGroups;
const db_1 = require("@/src/server/core/db");
const placeholder_groups_json_1 = __importDefault(require("@/src/server/core/db/seeds/data/placeholder-groups.json"));
const slugify_1 = __importDefault(require("slugify"));
async function seedGroups(categoryBySlug, usersByEmail) {
    const groupBySlug = {};
    for (const group of placeholder_groups_json_1.default) {
        const nameAndLocation = `${group.name} ${group.location}`;
        const slug = (0, slugify_1.default)(nameAndLocation, {
            replacement: "-",
            lower: true,
            trim: true,
        });
        const organizerId = usersByEmail[group.organizer_email.toLowerCase().trim()];
        const categorySlug = group.category.trim().toLowerCase();
        const categoryId = categoryBySlug[categorySlug];
        const row = {
            name: group.name,
            description: group.description,
            location: group.location,
            slug: slug,
            category_id: categoryId,
            organizer_email: group.organizer_email,
            organizer_id: organizerId,
        };
        const inserted = await db_1.db
            .insertInto("groups")
            .values(row)
            .onConflict((c) => c.column("slug").doNothing())
            .returning(["id", "slug"])
            .execute();
        if (inserted.length > 0) {
            groupBySlug[inserted[0].slug] = inserted[0].id;
        }
        else {
            const existing = await db_1.db
                .selectFrom("groups")
                .select(["id", "slug"])
                .where("slug", "=", slug)
                .executeTakeFirstOrThrow();
            groupBySlug[existing.slug] = existing.id;
        }
    }
    console.log(`Seeded ${placeholder_groups_json_1.default.length} groups`);
    console.log({
        Slugs: groupBySlug,
    });
    return groupBySlug;
}
//# sourceMappingURL=seedGroups.js.map