"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `create extension if not exists "pgcrypto"`.execute(db);
    await db.schema
        .createTable("notifications")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("group_id", "uuid", (col) => col.notNull().references("groups.id").onDelete("cascade"))
        .addColumn("user_id", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
        .addColumn("subject", "text", (col) => col.notNull())
        .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(null))
        .addColumn("status", "text", (col) => col.notNull().defaultTo("new"))
        .addColumn("message", "text", (col) => col.notNull())
        .addColumn("priority", "text", (col) => col.notNull())
        .execute();
    await db.schema
        .createIndex("notifications_user_created_idx")
        .on("notifications")
        .columns(["user_id", "created_at"])
        .execute();
}
//# sourceMappingURL=008_create_notifications_table.js.map