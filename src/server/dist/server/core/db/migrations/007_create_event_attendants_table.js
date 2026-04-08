"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
const kysely_1 = require("kysely");
async function checkAttendeeStatusConstraint(db) {
    await (0, kysely_1.sql) `
  alter table event_attendants
  add constraint event_attendants_status_check
  check (status in ('going', 'interested', 'not_going'))
`.execute(db);
}
async function up(db) {
    const tableName = "event_attendants";
    await (0, kysely_1.sql) `create extension if not exists "pgcrypto"`.execute(db);
    await db.schema
        .createTable(tableName)
        .ifNotExists()
        .addColumn("event_id", "uuid", (col) => col.notNull().references("events.id").onDelete("cascade"))
        .addColumn("user_id", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
        .addColumn("status", "text", (col) => col.notNull().defaultTo("going"))
        .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(null))
        .addPrimaryKeyConstraint("event_attendants_pk", ["event_id", "user_id"])
        .execute();
    await checkAttendeeStatusConstraint(db);
}
//# sourceMappingURL=007_create_event_attendants_table.js.map