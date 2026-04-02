import { DBClient } from "@/src/server/src/db";
import { ParticipationsService } from "@/src/server/src/service/services/participationsService";
import { UserService } from "@/src/server/src/service/services/userService";
import { GroupService } from "@/src/server/src/service/services/groupService";
import { Authorization } from "@/src/server/src/service/auth/authorization";
import { Authentication } from "@/src/server/src/service/services/SessionService";
import { EventsService } from "@/src/server/src/service/services/EventsService";
import { NotificatonService } from "@/src/server/src/service/services/notificationService";

export class Domains {
  public readonly participations: ParticipationsService;
  public readonly users: UserService;
  public readonly session: Authentication;
  public readonly groups: GroupService;
  public readonly events: EventsService;
  public readonly notifications: NotificatonService;

  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.session = new Authentication(this.db, this.policy);
    this.participations = new ParticipationsService(this.db, this.policy);
    this.users = new UserService(this.db, this.policy);
    this.groups = new GroupService(this.db, this.policy);
    this.events = new EventsService(this.db, this.policy);
    this.notifications = new NotificatonService(this.db, this.policy);
  }
}
