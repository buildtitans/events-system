"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `create extension if not exists "pgcrypto"`.execute(db);
    await db.schema
        .createTable("sessions")
        .ifNotExists()
        .addColumn("id", "text", (col) => col.primaryKey())
        .addColumn("user_id", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
        .addColumn("expires_at", "timestamptz", (col) => col.notNull())
        .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .execute();
}
//# sourceMappingURL=005_create_sessions_table.js.map