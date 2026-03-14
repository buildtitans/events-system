import { DBClient } from "../../db";
import { AuthorizationService } from "./authorizationService";

export class SessionService {
  constructor(
    private readonly db: DBClient,
    private readonly policy: AuthorizationService,
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
