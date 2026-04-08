"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `create extension if not exists "pgcrypto"`.execute(db);
    db.schema
        .createTable("users")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .addColumn("email", "text", (col) => col.notNull().unique())
        .addColumn("password_hash", "text", (col) => col.notNull())
        .execute();
}
//# sourceMappingURL=002_create_users_table.js.map