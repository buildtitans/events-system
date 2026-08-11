import { IResendPasswordResetMailer } from "@/src/server/core/service/integrations/resendPasswordResetMailer";
import {
  IPasswordResetEmailService,
  PasswordResetEmailServiceDB,
} from "./types";

export class PasswordResetEmailService implements IPasswordResetEmailService {
  constructor(
    private readonly db: PasswordResetEmailServiceDB,
    private readonly mailer: IResendPasswordResetMailer,
  ) {}

  async request(email: string): Promise<{ ok: true }> {
    const result = await this.db.auth.requestPasswordReset(email);
    if (!result.token) return { ok: true };
    await this.mailer.sendEmail(result.token, email);
    return { ok: true };
  }
}
