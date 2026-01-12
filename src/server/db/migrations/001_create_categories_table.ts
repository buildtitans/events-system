import { Kysely, sql } from "kysely";


export async function up(db: Kysely<any>): Promise<void> {
    //TODO: finish writing sql script to execute creation of the "categories" table

    await sql`create extension if not exists "pgcrypto"`.execute(db);

    await db.schema
        .createTable("categories").ifNotExists()
        .addColumn("id", "uuid", (col) => (
            col
                .primaryKey()
                .notNull()
                .defaultTo(sql`gen_random_uuid()`)
        ))
        .addColumn("slug", "text", (col) =>
            col
                .notNull()
                .unique()
        )
        .addColumn("name", "text", (col) => (
            col
                .unique()
                .notNull()
        ))
        .addColumn("icon", "text", (col) => (
            col
                .notNull()
        ))
        .execute()


    await sql`
    
  `.execute(db);

    await sql`
    
  `.execute(db);
}