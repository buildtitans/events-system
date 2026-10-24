import { IAuthorization } from "../auth/authorization";
import { validateLoginCredentials } from "../../lib/validation/validateLoginCredentials";
import {
  IPasswordResetEmailService,
  ISessionService,
  SessionServiceDb,
} from "./types";
import { LoginCredentialsSchemaType } from "../../../../schemas/auth/loginCredentialsSchema";
import { RecoveredSessionSchemaType } from "../../../../schemas/auth/recoveredSessionSchema";

export class SessionService implements ISessionService {
  constructor(
    private readonly db: SessionServiceDb,
    private readonly policy: IAuthorization,
    private readonly emailer: IPasswordResetEmailService,
  ) {}

  async signUp(credentials: LoginCredentialsSchemaType) {
    const { email, password } = validateLoginCredentials(
      credentials.email,
      credentials.password,
    );

    return await this.db.auth.signUp(email, password);
  }

  async login(emailInput: string, passwordInput: string) {
    const { email, password } = validateLoginCredentials(
      emailInput,
      passwordInput,
    );

    return await this.db.auth.login(email, password);
  }

  async logout(token: string | undefined) {
    const cookie = this.policy.requireToken(token);

    return await this.db.auth.logOut(cookie);
  }

  async recoverSession(
    token: string | undefined | null,
  ): Promise<RecoveredSessionSchemaType> {
    const cookie = this.policy.requireToken(token);
    return await this.db.auth.recover(cookie);
  }

  async resetPassword(token: string, password: string) {
    const didReset = await this.db.auth.resetPassword(token, password);

    if (didReset === false) {
      throw new Error("This password reset link is invalid or has expired.");
    }

    return { ok: didReset };
  }

  async emailForPwReset(email: string) {
    return await this.emailer.request(email);
  }
}
