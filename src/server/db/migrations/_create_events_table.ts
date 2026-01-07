import { Kysely, sql } from "kysely";

//TODO: implement in script to create db on docker compose up

export async function up(db: Kysely<any>): Promise<void> {

    await sql`create extension if not exists "pgcrypto"`.execute(db);
    //enabling of random uuid generation

    await db.schema
        .createTable("events")
        .addColumn("id", "uuid", (col) =>
            col
                .primaryKey()
                .defaultTo(sql`gen_random_uuid()`)
        )
        .addColumn("img", "text", (col) =>
            col
                .defaultTo(null)
        )
        .addColumn("tag", "text", (col) =>
            col
                .notNull()
        )
        .addColumn("title", "text", (col) =>
            col
                .notNull()
        )
        .addColumn("description", "text", (col) =>
            col
                .notNull()
        )
        .addColumn("authors", "jsonb", (col) =>
            col
                .notNull()
        )
        .addColumn("created_at", "timestamptz", (col) =>
            col
                .notNull()
                .defaultTo(sql`now()`)
        )
        .addColumn("updated_at", "timestamptz", (col) =>
            col
                .notNull()
                .defaultTo(sql`now()`)
        )
        .execute();

    await sql`
    create or replace function set_events_updated_at()
    returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language plpgsql;
  `.execute(db);

    await sql`
    create trigger trg_events_set_updated_at
    before update on events
    for each row
    execute function set_events_updated_at();
  `.execute(db);

}