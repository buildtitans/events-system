import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {

    await sql`create extension if not exists "pgcrypto"`.execute(db);

    await db.schema
        .createTable("notifications")
        .ifNotExists()
        .addColumn("id", "uuid", col =>

            col.primaryKey().defaultTo(sql`gen_random_uuid()`)
        )

        .addColumn("group_id", "uuid", (col) =>
            col
                .notNull()
                .references("groups.id")
                .onDelete("cascade")
        )
        .addColumn("user_id", "uuid", col =>
            col
                .notNull()
                .references("users.id")
                .onDelete("cascade")
        )
        .addColumn("created_at", "timestamptz", col =>
            col
                .notNull()
                .defaultTo(sql`now()`)
        )
        .addColumn("updated_at", "timestamptz", col =>
            col
                .defaultTo(null)
        )
        .addColumn("seen", "boolean", col =>
            col
                .notNull()
                .defaultTo(false)
        )
        .addColumn("message", "text", col =>
            col
                .notNull()
        )
        .addColumn("priority", "text", col =>
            col
                .notNull()
        )
        .execute();


    await db.schema
        .createIndex("notifications_user_created_idx")
        .on("notifications")
        .columns(["user_id", "created_at"])
        .execute();
};