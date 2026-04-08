"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = seedCategories;
const db_1 = require("@/src/server/core/db");
const categories_placeholder_json_1 = __importDefault(require("../data/categories-placeholder.json"));
async function seedCategories() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("Seeding disabled in production");
    }
    const categoryBySlug = {};
    for (const category of categories_placeholder_json_1.default) {
        const row = {
            name: category.name,
            icon: category.icon,
            slug: category.slug,
        };
        const inserted = await db_1.db
            .insertInto("categories")
            .values(row)
            .onConflict((conflict) => conflict.column("slug").doNothing())
            .returning(["id", "slug"])
            .execute();
        if (inserted.length > 0) {
            const { id, slug } = inserted[0];
            categoryBySlug[slug] = id;
        }
        else {
            const existing = await db_1.db
                .selectFrom("categories")
                .select(["id", "slug"])
                .where("slug", "=", row.slug)
                .executeTakeFirstOrThrow();
            categoryBySlug[existing.slug] = existing.id;
        }
    }
    console.log(`Seeded ${categories_placeholder_json_1.default.length} events from placeholder-events.json`);
    return categoryBySlug;
}
//# sourceMappingURL=seedCategories.js.map