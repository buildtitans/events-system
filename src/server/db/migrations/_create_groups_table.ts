import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {

    await sql`create extension if not exists "pgcrypto"`.execute(db);

    await db.schema
        .createTable("groups").ifNotExists()
        .addColumn("id", "uuid", (col) =>
            col.primaryKey()
                .defaultTo(sql`gen_random_uuid()`)
        )
        .addColumn("name", "text", (col) =>
            col.notNull()
        )
        .addColumn("description", "text", (col) =>
            col.defaultTo(null)
        )
        .addColumn("location", "text", (col) =>
            col.defaultTo(null)
        )
        .addColumn("organizer_id", "uuid", (col) =>
            col.defaultTo(null)
        )
        .addColumn("category_id", "uuid", (col) =>
            col
                .references("categories.id")
                .onDelete("set null")
        )
        .addColumn("created_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`now()`)
        )
        .addColumn("updated_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`now()`)
        )
        .addColumn("slug", "text", (col) =>
            col.notNull().unique()
        )
        .execute()

    await sql`create or replace function set_groups_updated_at()
        returns trigger as $$
        begin
            new.updated_at = now();
            return new;
        end;
        $$ language plpgsql;
        `.execute(db);

    await sql`
      create trigger trg_groups_set_updated_at
      before update on groups
      for each row
      execute function set_groups_updated_at();
    `.execute(db);
}