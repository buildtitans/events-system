import { Resend } from "resend";
import { getEnv } from "../../lib/init/getEnv";
import type { CreateEmailOptions } from "resend";

function getResendKey() {
  if (process.env.NODE_ENV === "production") {
    return getEnv("resendProdKey");
  } else {
    return getEnv("resendDevKey");
  }
}

const RESEND_API_KEY = getResendKey();

export class EmailService {
  private readonly resend: Resend;
  constructor() {
    this.resend = new Resend(RESEND_API_KEY);
  }

  public async sendResetEmail(email: string, resetUrl: string) {
    const { data, error } = await this.resend.emails.send(
      this.resendOptions(resetUrl, email),
    );

    if (error) {
      throw new Error(`Failed to send reset email: ${error.message}`);
    }
    return data;
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
