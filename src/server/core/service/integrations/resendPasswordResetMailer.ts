import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import { ResendVariables } from "../../lib/init/resendSecrets";

export class ResendPasswordResetMailer {
  private readonly baseResetUrl: ResendVariables["resendUrl"];
  private readonly resendKey: ResendVariables["resendKey"];
  private readonly resend: Resend;
  constructor(private readonly resendSecrets: ResendVariables) {
    this.baseResetUrl = this.resendSecrets.resendUrl;
    this.resendKey = this.resendSecrets.resendKey;
    this.resend = new Resend(this.resendKey);
  }

  public async sendEmail(token: string, email: string) {
    const url = this.constructUrl(token);
    const { data, error } = await this.resend.emails.send(
      this.resendOptions(url, email),
    );

    if (error) {
      throw new Error(`Failed to send reset email: ${error.message}`);
    }
    return data;
  }

  private constructUrl(token: string) {
    const url = new URL(this.baseResetUrl);
    url.searchParams.set("token", token);
    return url.toString();
  }

  private resendOptions(resetUrl: string, email: string): CreateEmailOptions {
    return {
      from: this.getFromAddress(),
      to: [email],
      subject: "Password Reset Request",
      html: `<p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>`,
      text: `We received a request to reset your password: ${resetUrl}`,
    };
  }

  private getFromAddress() {
    if (process.env.NODE_ENV === "production") {
      return "Events System <no-reply@events-system.dev>";
    } else {
      return "onboarding@resend.dev";
    }
  }
}
