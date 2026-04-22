import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`create extension if not exists "pgcrypto"`.execute(db);

  await db.schema
    .createTable("password_reset_tokens")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("user_id", "uuid", (col) => col.notNull())
    .addColumn("token_hash", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("used_at", "timestamptz")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addForeignKeyConstraint(
      "password_reset_tokens_user_id_fk",
      ["user_id"],
      "users",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createIndex("password_reset_tokens_token_hash_idx")
    .on("password_reset_tokens")
    .column("token_hash")
    .unique()
    .execute();

  await db.schema
    .createIndex("password_reset_tokens_user_id_idx")
    .on("password_reset_tokens")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("password_reset_tokens_expires_at_idx")
    .on("password_reset_tokens")
    .column("expires_at")
    .execute();
}
