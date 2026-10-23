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
import { RecoveredSessionSchemaType } from "../../../../../../schemas/auth/recoveredSessionSchema";
import { AuthValidator } from "./authValidator";

export interface IAuthRepository {
  recover(token: string): Promise<RecoveredSessionSchemaType>;
  authenticate(token: string | undefined): Promise<PublicUserSchemaType | null>;
  signUp(email: string, password: string): Promise<NewUserResponse>;
  login(
    input_email: string,
    input_password: string,
  ): Promise<AuthClientLoginResponse>;
  logOut(token: string): Promise<boolean>;
  getEmailByUserId(user_id: DbUserSchemaType["id"]): Promise<{ email: string }>;
  resetPassword(token: string, password: string): Promise<boolean>;
  requestPasswordReset(emailInput: string): PasswordResetRequestResult;
}

export class AuthRepository implements IAuthRepository {
  private readonly write: AuthWriter;
  private readonly read: AuthReader;
  private readonly validate: AuthValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.write = new AuthWriter(this.db);
    this.read = new AuthReader(this.db);
    this.validate = new AuthValidator();
  }

  async authenticate(
    token: string | undefined,
  ): Promise<PublicUserSchemaType | null> {
    if (!token) return null;

    const user = await this.read.authenticatedUser(token);
    return user ?? null;
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

  async recover(token: string): Promise<RecoveredSessionSchemaType> {
    const result = await this.read.recoverSession(token);
    return this.validate.recoveredSession(result);
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    return await this.write.changePassword(token, password);
  }
}
