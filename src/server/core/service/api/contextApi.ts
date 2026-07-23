import { db, DBClient } from "@/src/server/core/db";
import { RoleBasedAccessHandler } from "@/src/server/core/service/auth/roleBasedAccessHandler";
import { Authorization } from "@/src/server/core/service/auth/authorization";
import { Domains } from "../domains/domains";
import { resendSecrets } from "../../lib/init/resendSecrets";
import { IDomains } from "../domains/types";

export class ContextApi {
  private readonly db: DBClient;
  private readonly auth: RoleBasedAccessHandler;
  private readonly policy: Authorization;
  public readonly domains: IDomains;
  constructor() {
    this.db = new DBClient(db);
    this.auth = new RoleBasedAccessHandler(this.db);
    this.policy = new Authorization(this.auth);
    this.domains = new Domains(this.db, this.policy, resendSecrets);
  }
}
