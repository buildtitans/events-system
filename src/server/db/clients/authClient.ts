import { Kysely } from "kysely";
import { DB } from "../types/db";
import argon2 from "argon2";
import { DbUserSchemaType, PublicUserSchemaType } from "@/src/schemas/userSchema";
import crypto from "crypto";
import type { StoredSession, AuthClientLoginResponse } from "./types/types";

export class AuthClient {

    constructor(private readonly db: Kysely<DB>) { }

    async authenticate(token: string): Promise<PublicUserSchemaType | null> {

        const session = await this.getSession(token);
        if (!session) return null;

        const user = await this.db
            .selectFrom("users")
            .select(["id", "email"])
            .where("id", "=", session.user_id)
            .executeTakeFirst();

        if (!user) return null;

        return user;
    }


    async login(
        input_email: string,
        input_password: string
    ): Promise<AuthClientLoginResponse> {

        const dbUser = await this.verifyCredentials(input_email, input_password);
        const session = await this.createSession(dbUser.id);

        const publicUser: PublicUserSchemaType = {
            id: dbUser.id,
            email: dbUser.email
        }

        return { user: publicUser, session };
    }

    async verifyCredentials(
        input_email: string,
        input_password: string
    ): Promise<DbUserSchemaType> {

        const user = await this.db
            .selectFrom("users")
            .select(["id", "email", "password_hash"])
            .where("email", "=", input_email)
            .executeTakeFirst();

        if (!user) {
            throw new Error(`That email doesn't match any of our records`)
        }

        const ok = await argon2.verify(user?.password_hash, input_password);

        if (!ok) {
            throw new Error(`Invalid email or password`)
        }
        return user
    }

    async createSession(
        user_id: string
    ): Promise<StoredSession> {

        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        const session = await this.db
            .insertInto("sessions")
            .values({
                id: token,
                user_id: user_id,
                expires_at: expiresAt
            })
            .returning(["id", "user_id", "expires_at"])
            .executeTakeFirstOrThrow()

        return session;
    };


    async getSession(
        token?: string
    ): Promise<StoredSession | null> {

        if (!token) return null;

        const session = await this.db
            .selectFrom("sessions")
            .select(["id", "user_id", "expires_at"])
            .where("id", "=", token)
            .where("expires_at", ">", new Date())
            .executeTakeFirst();

        if (!session) return null;

        return session;
    }
}