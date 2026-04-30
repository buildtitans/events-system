import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";
import { validateLoginCredentials } from "../../lib/validation/validateLoginCredentials";
import { EmailService } from "./emailService";

export class SessionService {
  private readonly email: EmailService;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.email = new EmailService();
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

  async recoverSession(token: string | undefined | null) {
    const cookie = this.policy.requireToken(token);

    const session = await this.db.auth.getSession(cookie);

    if (!session) return undefined;

    if (session?.expires_at <= new Date()) {
      return undefined;
    }

    return session;
  }

  async resetPassword(token: string, password: string): Promise<{ ok: true }> {
    const didReset = await this.db.auth.resetPassword(token, password);

    if (!didReset) {
      throw new Error("This password reset link is invalid or has expired.");
    }

    return { ok: true };
  }

  async requestPwReset(email: string): Promise<{ ok: true }> {
    const result = await this.db.auth.requestPasswordReset(email);

    if (!result.token) {
      return { ok: true };
    }

    await this.email.sendEmail(result.token, email);
    return { ok: true };
  }
}
