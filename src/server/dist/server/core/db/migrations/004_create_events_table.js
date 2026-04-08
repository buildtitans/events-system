"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `create extension if not exists "pgcrypto"`.execute(db);
    await db.schema
        .createTable("events")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("group_id", "uuid", (col) => col.references("groups.id").onDelete("cascade").notNull())
        .addColumn("status", "text", (col) => col.notNull())
        .addColumn("img", "text", (col) => col.defaultTo(null))
        .addColumn("tag", "text", (col) => col.notNull())
        .addColumn("title", "text", (col) => col.notNull())
        .addColumn("description", "text", (col) => col.notNull())
        .addColumn("meeting_location", "text", (col) => col.notNull())
        .addColumn("starts_at", "timestamptz", (col) => col.notNull())
        .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .addUniqueConstraint("events_group_start_unique", ["group_id", "starts_at"])
        .execute();
    await (0, kysely_1.sql) `
    create or replace function set_events_updated_at()
    returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language plpgsql;
  `.execute(db);
    await (0, kysely_1.sql) `
    create trigger trg_events_set_updated_at
    before update on events
    for each row
    execute function set_events_updated_at();
  `.execute(db);
}
async function down(db) {
    await db.schema.dropTable("events").execute();
}
//# sourceMappingURL=004_create_events_table.js.map