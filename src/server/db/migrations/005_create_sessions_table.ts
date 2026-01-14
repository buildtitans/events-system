import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {

    await sql`create extension if not exists "pgcrypto"`.execute(db);

    await db.schema
        .createTable("sessions").ifNotExists()

        .addColumn("id", "text", (col) =>
            col.primaryKey()
        )
        .addColumn("user_id", "uuid", (col) =>
            col
                .notNull()
                .references("users.id")
                .onDelete("cascade")
        )
        .addColumn("expires_at", "timestamptz", (col) =>
            col
                .notNull())
        .addColumn("created_at", "timestamptz", (col) =>
            col
                .notNull()
                .defaultTo(sql`now()`)
        )
        .execute()
}