import { DBClient } from "@/src/server/core/db";
import { ParticipationsService } from "@/src/server/core/service/services/participationsService";
import { UserService } from "@/src/server/core/service/services/userService";
import { GroupService } from "@/src/server/core/service/services/groupService";
import { Authorization } from "@/src/server/core/service/auth/authorization";
import { Authentication } from "@/src/server/core/service/services/SessionService";
import { EventService } from "@/src/server/core/service/services/EventService";
import { NotificatonService } from "@/src/server/core/service/services/notificationService";

export class Domains {
  public readonly participations: ParticipationsService;
  public readonly users: UserService;
  public readonly session: Authentication;
  public readonly groups: GroupService;
  public readonly events: EventService;
  public readonly notifications: NotificatonService;

  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.session = new Authentication(this.db, this.policy);
    this.participations = new ParticipationsService(this.db, this.policy);
    this.users = new UserService(this.db, this.policy);
    this.groups = new GroupService(this.db, this.policy);
    this.events = new EventService(this.db, this.policy);
    this.notifications = new NotificatonService(this.db, this.policy);
  }
}
