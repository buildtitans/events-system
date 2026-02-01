import { type Kysely, sql } from "kysely";

async function checkAttendeeStatusConstraint(db: Kysely<any>) {

    await sql`
  alter table event_attendants
  add constraint event_attendants_status_check
  check (status in ('going', 'interested', 'not_going'))
`.execute(db);
}


export async function up(db: Kysely<any>): Promise<void> {
    const tableName = "event_attendants";

    await sql`create extension if not exists "pgcrypto"`.execute(db);


    await db.schema
        .createTable(tableName)
        .ifNotExists()

        .addColumn("event_id", "uuid", (col) =>
            col
                .notNull()
                .references("events.id")
                .onDelete("cascade")
        )

        .addColumn("user_id", "uuid", (col) =>
            col
                .notNull()
                .references("users.id")
                .onDelete("cascade")
        )

        .addColumn("status", "text", (col) =>
            col.notNull().defaultTo("going")
        )

        .addColumn("created_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`now()`)
        )

        .addColumn("updated_at", "timestamptz", (col) =>
            col.defaultTo(null)
        )

        .addPrimaryKeyConstraint("event_attendants_pk", ["event_id", "user_id"])

        .execute();


    await checkAttendeeStatusConstraint(db);
};