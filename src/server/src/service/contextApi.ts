import { db, DBClient } from "../db";
import { RoleBasedAccessHandler } from "./auth/roleBasedAccessHandler";
import { Authorization } from "./auth/authorization";
import { Domains } from "./domains";

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
