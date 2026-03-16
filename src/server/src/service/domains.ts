import { DBClient } from "../db";
import { ParticipationsService } from "./services/participationsService";
import { UserService } from "./services/userService";
import { GroupService } from "./services/groupService";
import { Authorization } from "./auth/authorization";
import { Athentication } from "./services/SessionService";
import { EventsService } from "@/src/server/src/service/services/EventsService";
import { NotificatonService } from "@/src/server/src/service/services/notificationService";

export class Domains {
  public readonly participations: ParticipationsService;
  public readonly users: UserService;
  public readonly session: Athentication;
  public readonly groups: GroupService;
  public readonly events: EventsService;
  public readonly notifications: NotificatonService;

  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.session = new Athentication(this.db, this.policy);
    this.participations = new ParticipationsService(this.db, this.policy);
    this.users = new UserService(this.db, this.policy);
    this.groups = new GroupService(this.db, this.policy);
    this.events = new EventsService(this.db, this.policy);
    this.notifications = new NotificatonService(this.db, this.policy);
  }
}
