import { validateLoginInput } from "@/src/schemas/auth/loginCredentialsSchema";
import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";

export class Authentication {
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {}

  async login(emailInput: string, passwordInput: string) {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput;

    const validated = validateLoginInput({
      email,
      password,
    });

    return await this.db.auth.login(validated.email, validated.password);
  }

  async logout(token: string | undefined) {
    const cookie = this.policy.requireToken(token);

    return await this.db.auth.logOut(cookie);
  }

  async recoverSession(token: string | undefined | null) {
    const cookie = this.policy.requireToken(token);

    return this.db.auth.getSession(cookie);
  }
}
