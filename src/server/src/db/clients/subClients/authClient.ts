import { Kysely } from "kysely";
import { DB } from "../../types/db";
import {
  DbUserSchemaType,
  PublicUserSchemaType,
} from "@/src/schemas/auth/userSchema";
import type {
  StoredSession,
  AuthClientLoginResponse,
  NewUserResponse,
} from "../types/types";
import crypto from "crypto";
import argon2 from "argon2";

export class AuthClient {
  constructor(private readonly db: Kysely<DB>) {}

  async authenticate(token: string): Promise<PublicUserSchemaType | null> {
    const session = await this.getSession(token);

    if (!session) return null;

    const user = await this.db
      .selectFrom("users")
      .select(["id", "email"])
      .where("id", "=", session.user_id)
      .executeTakeFirstOrThrow();

    return user;
  }

  async signUp(email: string, password: string): Promise<NewUserResponse> {
    const hashedPw = await this.hashNewPassword(password);

    const newUser = await this.db
      .insertInto("users")
      .values({
        email,
        password_hash: hashedPw,
      })
      .returning(["id", "email"])
      .executeTakeFirstOrThrow();

    return newUser;
  }

  async login(
    input_email: string,
    input_password: string,
  ): Promise<AuthClientLoginResponse> {
    const dbUser = await this.verifyCredentials(input_email, input_password);
    const session = await this.createSession(dbUser.id);

    const publicUser: PublicUserSchemaType = {
      id: dbUser.id,
      email: dbUser.email,
    };

    return { user: publicUser, session };
  }

  async logOut(token: string): Promise<boolean> {
    const result = await this.db
      .deleteFrom("sessions")
      .where("id", "=", token)
      .execute();

    return Number(result[0].numDeletedRows ?? 0) > 0;
  }

  private async verifyCredentials(
    input_email: string,
    input_password: string,
  ): Promise<DbUserSchemaType> {
    const user = await this.db
      .selectFrom("users")
      .select(["id", "email", "password_hash"])
      .where("email", "=", input_email)
      .executeTakeFirst();

    if (!user) {
      throw new Error(`That email doesn't match any of our records`);
    }

    const ok = await argon2.verify(user?.password_hash, input_password);
    if (!ok) {
      throw new Error(`Invalid email or password`);
    }
    return user;
  }

  private async hashNewPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async createSession(user_id: string): Promise<StoredSession> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const session = await this.db
      .insertInto("sessions")
      .values({
        id: token,
        user_id: user_id,
        expires_at: expiresAt,
      })
      .returning(["id", "user_id", "expires_at"])
      .executeTakeFirstOrThrow();

    return session;
  }

  async getSession(token: string): Promise<StoredSession | undefined> {
    if (!token) return undefined;

    const session = await this.db
      .selectFrom("sessions")
      .select(["id", "user_id", "expires_at"])
      .where("id", "=", token)
      .where("expires_at", ">", new Date())
      .executeTakeFirst();

    return session;
  }
}
