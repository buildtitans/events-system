import { db, DBClient } from "../db";
import { RoleBasedAccessHandler } from "./handlers/roleBasedAccessHandler";
import { AuthorizationService } from "./services/authorizationService";
import { Domains } from "./domains";

export class ContextApi {
  private readonly db: DBClient;
  private readonly auth: RoleBasedAccessHandler;
  private readonly policy: AuthorizationService;
  public readonly domains: Domains;
  constructor() {
    this.db = new DBClient(db);
    this.auth = new RoleBasedAccessHandler(this.db);
    this.policy = new AuthorizationService(this.auth);
    this.domains = new Domains(this.db, this.policy);
  }
}
