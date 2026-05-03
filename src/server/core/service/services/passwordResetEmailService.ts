import { DBClient } from "../../db";
import { ResendVariables } from "../../lib/init/resendSecrets";
import { ResendPasswordResetMailer } from "../integrations/resendPasswordResetMailer";

export class PasswordResetEmailService {
  private readonly mailer: ResendPasswordResetMailer;
  constructor(
    private readonly db: DBClient,
    private readonly resendSecrets: ResendVariables,
  ) {
    this.mailer = new ResendPasswordResetMailer(this.resendSecrets);
  }

  async request(email: string): Promise<{ ok: true }> {
    const result = await this.db.auth.requestPasswordReset(email);
    if (!result.token) return { ok: true };
    await this.mailer.sendEmail(result.token, email);
    return { ok: true };
  }
}
