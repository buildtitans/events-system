import { db, DBClient } from "@/src/server/src/db";
import { RoleBasedAccessHandler } from "@/src/server/src/service/auth/roleBasedAccessHandler";
import { Authorization } from "@/src/server/src/service/auth/authorization";
import { Domains } from "@/src/server/src/service/domains/index";

export class ContextApi {
  private readonly db: DBClient;
  private readonly auth: RoleBasedAccessHandler;
  private readonly policy: Authorization;
  public readonly domains: Domains;
  constructor() {
    this.db = new DBClient(db);
    this.auth = new RoleBasedAccessHandler(this.db);
    this.policy = new Authorization(this.auth);
    this.domains = new Domains(this.db, this.policy);
  }
}
