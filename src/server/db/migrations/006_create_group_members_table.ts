import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {

    await sql`create extension if not exists "pgcrypto"`.execute(db);

    await db.schema
        .createTable("group_members")
        .ifNotExists()

        .addColumn("group_id", "uuid", (col) =>
            col.notNull().references("groups.id").onDelete("cascade")
        )

        .addColumn("user_id", "uuid", (col) =>
            col.notNull().references("users.id").onDelete("cascade")
        )

        .addColumn("role", "text", (col) =>
            col.notNull().defaultTo("member")
        )

        .addColumn("joined_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`now()`)
        )

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

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("group_members").ifExists().execute();
}
