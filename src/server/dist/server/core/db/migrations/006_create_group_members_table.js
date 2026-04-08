"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `create extension if not exists "pgcrypto"`.execute(db);
    await db.schema
        .createTable("group_members")
        .ifNotExists()
        .addColumn("group_id", "uuid", (col) => col.notNull().references("groups.id").onDelete("cascade"))
        .addColumn("user_id", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
        .addColumn("role", "text", (col) => col.notNull().defaultTo("member"))
        .addColumn("joined_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
        .addPrimaryKeyConstraint("group_members_pk", ["group_id", "user_id"])
        .execute();
    await db.schema
        .createIndex("group_members_group_id_idx")
        .on("group_members")
        .column("group_id")
        .execute();
    await db.schema
        .createIndex("group_members_user_id_idx")
        .on("group_members")
        .column("user_id")
        .execute();
}
async function down(db) {
    await db.schema.dropTable("group_members").ifExists().execute();
}
//# sourceMappingURL=006_create_group_members_table.js.map