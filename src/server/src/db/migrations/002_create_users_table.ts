import { Kysely, sql } from "kysely";


export async function up(db: Kysely<any>): Promise<void> {

    await sql`create extension if not exists "pgcrypto"`.execute(db);

    db.schema
        .createTable("users").ifNotExists()
        .addColumn("id", "uuid", (col) => (
            col
                .primaryKey()
                .defaultTo(sql`gen_random_uuid()`)
        ))
        .addColumn("created_at", "timestamptz", (col) => (
            col
                .notNull()
                .defaultTo(sql`now()`)
        ))
        .addColumn("email", "text", (col) => (
            col
                .notNull().unique()
        ))
        .addColumn("password_hash", "text", (col) => (
            col.
                notNull()
        ))
        .execute()
}