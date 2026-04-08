"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `create extension if not exists "pgcrypto"`.execute(db);
    await db.schema
        .createTable("categories")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col
        .primaryKey()
        .notNull()
        .defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("slug", "text", (col) => col.notNull().unique())
        .addColumn("name", "text", (col) => col.unique().notNull())
        .addColumn("icon", "text", (col) => col.notNull())
        .execute();
    await (0, kysely_1.sql) `
    
  `.execute(db);
    await (0, kysely_1.sql) `
    
  `.execute(db);
}
//# sourceMappingURL=001_create_categories_table.js.map