import { Kysely } from "kysely";
import { DB } from "../../../types/db";
import {
  DbUserSchemaType,
  PublicUserSchemaType,
} from "@/src/schemas/auth/userSchema";
import type {
  StoredSession,
  AuthClientLoginResponse,
  NewUserResponse,
  PasswordResetRequestResult,
} from "../../types/types";
import { AuthWriter } from "./authWriter";
import { AuthReader } from "./authReader";

export interface IAuthRepository {
  authenticate(token: string | undefined): Promise<PublicUserSchemaType | null>;
  signUp(email: string, password: string): Promise<NewUserResponse>;
  login(
    input_email: string,
    input_password: string,
  ): Promise<AuthClientLoginResponse>;
  logOut(token: string): Promise<boolean>;
  getEmailByUserId(user_id: DbUserSchemaType["id"]): Promise<{ email: string }>;
  getSession(token: string): Promise<StoredSession | undefined>;
  resetPassword(token: string, password: string): Promise<boolean>;
  requestPasswordReset(emailInput: string): PasswordResetRequestResult;
}

export class AuthRepository implements IAuthRepository {
  private readonly write: AuthWriter;
  private readonly read: AuthReader;
  constructor(private readonly db: Kysely<DB>) {
    this.write = new AuthWriter(this.db);
    this.read = new AuthReader(this.db);
  }

  async authenticate(
    token: string | undefined,
  ): Promise<PublicUserSchemaType | null> {
    if (!token) return null;

    const session = await this.getSession(token);

    if (!session?.user_id) return null;

    return await this.read.getUser(session.user_id);
  }

  async signUp(email: string, password: string): Promise<NewUserResponse> {
    return await this.write.createNewUser(email, password);
  }

  async login(
    input_email: string,
    input_password: string,
  ): Promise<AuthClientLoginResponse> {
    const user = await this.read.verifyCredentials(input_email, input_password);
    const session = await this.write.createSession(user.id);

    return {
      status: "ok",
      user,
      session,
    };
  }

  async logOut(token: string): Promise<boolean> {
    return await this.write.endSession(token);
  }

  async getEmailByUserId(
    user_id: DbUserSchemaType["id"],
  ): Promise<{ email: string }> {
    return await this.read.emailByUserId(user_id);
  }

  async requestPasswordReset(emailInput: string): PasswordResetRequestResult {
    const { id } = await this.read.getUserForPwReset(emailInput);
    return await this.write.recordPasswordResetRequest(id);
  }

  async getSession(token: string): Promise<StoredSession | undefined> {
    return await this.read.checkSession(token);
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    return await this.write.changePassword(token, password);
  }
}
