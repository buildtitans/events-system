import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";

export class Athentication {
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {}

  async login(email: string, password: string) {
    return await this.db.auth.login(email, password);
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
