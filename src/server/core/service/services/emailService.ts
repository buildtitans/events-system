import { Resend } from "resend";
import { getEnv } from "../../lib/init/getEnv";

const RESEND_API_KEY = getEnv("resendDevKey");

export class EmailService {
  private readonly resend: Resend;
  constructor() {
    this.resend = new Resend(RESEND_API_KEY);
  }

  public async sendResetEmail(email: string, resetUrl: string) {
    const { data, error } = await this.resend.emails.send({
      from: "Events System <no-reply@events-system.dev>",
      to: [email],
      subject: "Password Reset Request",
      html: `
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
      `,
      text: `We received a request to reset your password: ${resetUrl}`,
    });

    if (error) {
      throw new Error(`Failed to send reset email: ${error.message}`);
    }

    return data;
  }
}
