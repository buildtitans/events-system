import { Kysely } from "kysely";
import { DB } from "../../../types/db";
import { PublicUserSchemaType } from "@/src/schemas/auth/userSchema";
import argon2 from "argon2";
import { StoredSession } from "../../types/types";
import { InvalidCredentialsError } from "@/src/server/core/lib/errors/invalidCredentialsError";

export class AuthReader {
  constructor(private readonly db: Kysely<DB>) {}

  async getUser(user_id: string) {
    return await this.db
      .selectFrom("users")
      .select(["id", "email"])
      .where("id", "=", user_id)
      .executeTakeFirstOrThrow();
  }

  async emailByUserId(
    user_id: PublicUserSchemaType["id"],
  ): Promise<{ email: string }> {
    return await this.db
      .selectFrom("users")
      .select("email")
      .where("id", "=", user_id)
      .executeTakeFirstOrThrow();
  }

  async verifyCredentials(
    input_email: string,
    input_password: string,
  ): Promise<PublicUserSchemaType> {
    const user = await this.db
      .selectFrom("users")
      .select(["id", "email", "password_hash"])
      .where("email", "=", input_email)
      .executeTakeFirst();

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const ok = await argon2.verify(user?.password_hash, input_password);
    if (!ok) {
      throw new InvalidCredentialsError();
    }
    return { id: user.id, email: user.email };
  }

  async getUserForPwReset(email: string) {
    return await this.db
      .selectFrom("users")
      .select(["id", "email"])
      .where("email", "=", email)
      .executeTakeFirstOrThrow();
  }

  async checkSession(token: string): Promise<StoredSession | undefined> {
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
