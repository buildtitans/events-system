import { ResendVariables } from "../../lib/init/resendSecrets";
import { ResendPasswordResetMailer } from "../integrations/resendPasswordResetMailer";
import {
  IPasswordResetEmailService,
  PasswordResetEmailServiceDB,
} from "./types";

export class PasswordResetEmailService implements IPasswordResetEmailService {
  private readonly mailer: ResendPasswordResetMailer;
  constructor(
    private readonly db: PasswordResetEmailServiceDB,
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
