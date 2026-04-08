"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `create extension if not exists "pgcrypto"`.execute(db);
    await db.schema
        .createTable("groups")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "text", (col) => col.notNull())
        .addColumn("description", "text", (col) => col.defaultTo(null))
        .addColumn("location", "text", (col) => col.defaultTo(null))
        .addColumn("organizer_id", "uuid", (col) => col.notNull().references("users.id").onDelete("restrict"))
        .addColumn("organizer_email", "text", (col) => col.defaultTo(null))
        .addColumn("category_id", "uuid", (col) => col.notNull().references("categories.id").onDelete("set null"))
        .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .addColumn("slug", "text", (col) => col.notNull().unique())
        .execute();
    await (0, kysely_1.sql) `create or replace function set_groups_updated_at()
        returns trigger as $$
        begin
            new.updated_at = now();
            return new;
        end;
        $$ language plpgsql;
        `.execute(db);
    await (0, kysely_1.sql) `
      create trigger trg_groups_set_updated_at
      before update on groups
      for each row
      execute function set_groups_updated_at();
    `.execute(db);
}
//# sourceMappingURL=003_create_groups_table.js.map