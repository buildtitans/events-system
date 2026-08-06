import { db, DBClient } from "@/src/server/core/db";
import {
  IRoleBasedAccessHandler,
  RoleBasedAccessHandler,
} from "@/src/server/core/service/auth/roleBasedAccessHandler";
import {
  Authorization,
  IAuthorization,
} from "@/src/server/core/service/auth/authorization";
import { Domains } from "../domains/domains";
import { resendSecrets } from "../../lib/init/resendSecrets";
import { IDomains } from "../domains/types";
import { IDBClient } from "../../db/access/client/dbClient";

export interface IContextApi {
  readonly domains: IDomains;
}

export class ContextApi implements IContextApi {
  private readonly db: IDBClient;
  private readonly auth: IRoleBasedAccessHandler;
  private readonly policy: IAuthorization;
  public readonly domains: IDomains;
  constructor() {
    this.db = new DBClient(db);
    this.auth = new RoleBasedAccessHandler(this.db);
    this.policy = new Authorization(this.auth);
    this.domains = new Domains(this.db, this.policy, resendSecrets);
  }
}
