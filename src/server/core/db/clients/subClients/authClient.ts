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
  PasswordResetRequestResult,
} from "../types/types";
import crypto from "crypto";
import argon2 from "argon2";

export class AuthClient {
  constructor(private readonly db: Kysely<DB>) {}

  async authenticate(
    token: string | undefined,
  ): Promise<PublicUserSchemaType | null> {
    if (!token) return null;

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
    try {
      const user = await this.verifyCredentials(input_email, input_password);
      const session = await this.createSession(user.id);
      return {
        status: "ok",
        user,
        session,
      };
    } catch {
      return {
        status: "failed",
      };
    }
  }

  async logOut(token: string): Promise<boolean> {
    const result = await this.db
      .deleteFrom("sessions")
      .where("id", "=", token)
      .execute();

    return Number(result[0].numDeletedRows ?? 0) > 0;
  }

  async getEmailByUserId(user_id: DbUserSchemaType["id"]) {
    return await this.db
      .selectFrom("users")
      .select("email")
      .where("id", "=", user_id)
      .executeTakeFirstOrThrow();
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

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 4);

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

  async resetPassword(token: string, password: string): Promise<boolean> {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const passwordHash = await this.hashNewPassword(password);

    return await this.db.transaction().execute(async (trx) => {
      const resetRecord = await trx
        .selectFrom("password_reset_tokens")
        .select(["id", "user_id", "expires_at", "used_at"])
        .where("token_hash", "=", tokenHash)
        .where("used_at", "is", null)
        .where("expires_at", ">", new Date())
        .executeTakeFirst();

      if (!resetRecord) {
        return false;
      }

      await trx
        .updateTable("users")
        .set({
          password_hash: passwordHash,
        })
        .where("id", "=", resetRecord.user_id)
        .execute();

      await trx
        .updateTable("password_reset_tokens")
        .set({
          used_at: new Date(),
        })
        .where("id", "=", resetRecord.id)
        .execute();

      await trx
        .deleteFrom("sessions")
        .where("user_id", "=", resetRecord.user_id)
        .execute();

      return true;
    });
  }

  async requestPasswordReset(emailInput: string): PasswordResetRequestResult {
    const { id } = await this.getUserForPwReset(emailInput);

    const { token, tokenHash, expiresAt } =
      await this.createResetTokenAndExpiration();

    const result = await this.db
      .insertInto("password_reset_tokens")
      .values({
        user_id: id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      })
      .returning(["created_at", "expires_at"])
      .executeTakeFirst();

    return {
      result,
      token,
    };
  }

  private async createResetTokenAndExpiration() {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    return {
      token,
      tokenHash,
      expiresAt,
    };
  }

  private async getUserForPwReset(email: string) {
    return await this.db
      .selectFrom("users")
      .select(["id", "email"])
      .where("email", "=", email)
      .executeTakeFirstOrThrow();
  }
}
