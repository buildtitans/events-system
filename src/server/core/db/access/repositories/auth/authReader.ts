import { Kysely } from "kysely";
import { DB } from "../../../types/db";
import { PublicUserSchemaType } from "@/src/schemas/auth/userSchema";
import argon2 from "argon2";
import { RecoveredSession } from "../../types/types";
import { InvalidCredentialsError } from "@/src/server/core/lib/errors/invalidCredentialsError";
import { RawReadSession } from "./types";

export class AuthReader {
  constructor(private readonly db: Kysely<DB>) {}

  async authenticatedUser(token: string) {
    return await this.db
      .selectFrom("sessions as s")
      .innerJoin("users as u", "s.user_id", "u.id")
      .select(["u.id", "u.email"])
      .where("s.id", "=", token)
      .where("s.expires_at", ">", new Date())
      .executeTakeFirst();
  }

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

  async recoverSession(token: string): Promise<RecoveredSession> {
    const result = await this.db
      .selectFrom("sessions as s")
      .innerJoin("users as u", "s.user_id", "u.id")
      .select((eb) => [
        "s.created_at",
        "s.expires_at",
        "s.id",
        "u.id as user_id",
        "u.email",
      ])
      .where("s.expires_at", ">", new Date())
      .where("s.id", "=", token)
      .executeTakeFirst();

    return this.toRecoveredSession(result);
  }

  private toRecoveredSession(result: RawReadSession): RecoveredSession {
    if (result === undefined) {
      return {
        kind: "anonymous",
      };
    }

    return {
      kind: "authenticated",
      data: {
        session: {
          id: result.id,
          expires_at: result.expires_at.toISOString(),
          created_at: result.created_at.toISOString(),
        },
        user: {
          email: result.email,
          user_id: result.user_id,
        },
      },
    };
  }
}
