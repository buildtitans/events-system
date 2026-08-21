import { Kysely } from "kysely";
import { DB } from "../../../types/db";
import {
  NewUserResponse,
  PasswordResetRequestResult,
  StoredSession,
} from "../../types/types";
import argon2 from "argon2";
import crypto from "crypto";

export class AuthWriter {
  constructor(private readonly db: Kysely<DB>) {}

  async createSession(user_id: string): Promise<StoredSession> {
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

  async endSession(token: string): Promise<boolean> {
    const result = await this.db
      .deleteFrom("sessions")
      .where("id", "=", token)
      .execute();

    return Number(result[0].numDeletedRows ?? 0) > 0;
  }

  async createNewUser(
    email: string,
    password: string,
  ): Promise<NewUserResponse> {
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

  async changePassword(token: string, password: string): Promise<boolean> {
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

  async recordPasswordResetRequest(
    user_id: string,
  ): PasswordResetRequestResult {
    const { token, tokenHash, expiresAt } =
      await this.createResetTokenAndExpiration();

    const result = await this.db
      .insertInto("password_reset_tokens")
      .values({
        user_id: user_id,
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

  private async hashNewPassword(password: string): Promise<string> {
    return argon2.hash(password);
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
}
