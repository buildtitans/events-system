import { db, DBClient } from "@/src/server/core/db";
import { RoleBasedAccessHandler } from "@/src/server/core/service/auth/roleBasedAccessHandler";
import { Authorization } from "@/src/server/core/service/auth/authorization";
import { Domains } from "@/src/server/core/service/domains/index";
import { resendSecrets } from "../../lib/init/resendSecrets";

export class ContextApi {
  private readonly db: DBClient;
  private readonly auth: RoleBasedAccessHandler;
  private readonly policy: Authorization;
  public readonly domains: Domains;
  constructor() {
    this.db = new DBClient(db);
    this.auth = new RoleBasedAccessHandler(this.db);
    this.policy = new Authorization(this.auth);
    this.domains = new Domains(this.db, this.policy, resendSecrets);
  }
}
