import { DBClient } from "@/src/server/core/db";
import { ParticipationsService } from "@/src/server/core/service/services/participationsService";
import { UserService } from "@/src/server/core/service/services/userService";
import { GroupService } from "@/src/server/core/service/services/groupService";
import { Authorization } from "@/src/server/core/service/auth/authorization";
import { SessionService } from "@/src/server/core/service/services/SessionService";
import { EventService } from "@/src/server/core/service/services/EventService";
import { NotificationService } from "@/src/server/core/service/services/notificationService";
import { ResendVariables } from "../../lib/init/resendSecrets";
import { PasswordResetEmailService } from "../services/passwordResetEmailService";

export class Domains {
  public readonly participations: ParticipationsService;
  public readonly users: UserService;
  public readonly session: SessionService;
  public readonly groups: GroupService;
  public readonly events: EventService;
  public readonly notifications: NotificationService;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
    private readonly resendSecrets: ResendVariables,
  ) {
    const emailer = new PasswordResetEmailService(this.db, this.resendSecrets);
    this.session = new SessionService(this.db, this.policy, emailer);
    this.participations = new ParticipationsService(this.db, this.policy);
    this.users = new UserService(this.db, this.policy);
    this.groups = new GroupService(this.db, this.policy);
    this.events = new EventService(this.db, this.policy);
    this.notifications = new NotificationService(this.db, this.policy);
  }
}
