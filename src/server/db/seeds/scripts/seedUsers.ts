import { db } from "@/src/server/db/db";
import type { Insertable } from "kysely";
import rawUsers from "../data/users-placeholder.json";
import type { Users } from "@/src/server/db/types/db";
import argon2 from "argon2";

type UserIdByEmail = Record<string, string>;

export async function seedUsers(): Promise<Record<string, string>> {

    if (process.env.NODE_ENV === 'production') {
        throw new Error('Seeding disabled in production');
    }

    const usersByEmail: UserIdByEmail = {};

    for (const user of rawUsers) {

        const hashed_pw = await argon2.hash(user.password);

        const row: Insertable<Users> = {
            email: user.email,
            password_hash: hashed_pw,
        }

        const inserted = await db
            .insertInto("users")
            .values(row)
            .onConflict((col) =>
                col
                    .column("email")
                    .doNothing()
            )
            .returning(["id", "email"])
            .executeTakeFirst();

        if (!inserted) {
            const existing = await db
                .selectFrom("users")
                .select(["id", "email"])
                .where("email", "=", user.email)
                .executeTakeFirstOrThrow()

            usersByEmail[existing.email] = existing.id;
        } else {
            usersByEmail[inserted.email] = inserted.id;
        }

    }

    return usersByEmail;
}