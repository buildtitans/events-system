import { db, DBClient } from "@/src/server/core/db";
import type { IRoleBasedAccessHandler } from "./auth/types";
import { RoleBasedAccessHandler } from "@/src/server/core/service/auth/roleBasedAccessHandler";
import {
  Authorization,
  IAuthorization,
} from "@/src/server/core/service/auth/authorization";
import { ServiceDomains } from "./domains/serviceDomains";
import { resendSecrets } from "../lib/init/resendSecrets";
import { IServiceDomains } from "./domains/types";
import { IDBClient } from "../db/access/client/dbClient";
import { IPasswordResetEmailService } from "./services/types";
import { PasswordResetEmailService } from "./services/passwordResetEmailService";
import { ResendPasswordResetMailer } from "./integrations/resendPasswordResetMailer";
import { IApplicationServices } from "./types";

export class ApplicationServices implements IApplicationServices {
  private readonly db: IDBClient;
  private readonly auth: IRoleBasedAccessHandler;
  private readonly policy: IAuthorization;
  private readonly emailer: IPasswordResetEmailService;
  public readonly domains: IServiceDomains;
  constructor() {
    this.db = new DBClient(db);
    this.auth = new RoleBasedAccessHandler(this.db);
    this.policy = new Authorization(this.auth);
    this.emailer = new PasswordResetEmailService(
      this.db,
      new ResendPasswordResetMailer(resendSecrets),
    );
    this.domains = new ServiceDomains(this.db, this.policy, this.emailer);
  }
}
