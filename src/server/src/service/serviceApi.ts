import { db, DBClient } from "../db";
import { RoleBasedAccessHandler } from "./handlers/roleBasedAccessHandler";
import { ParticipationsService } from "./services/participationsService";
import { UserService } from "./services/userService";
import { GroupManagementService } from "./services/groupService";
import { AuthorizationService } from "./services/authorizationService";
import { SessionService } from "./services/SessionService";
import { EventsService } from "@/src/server/src/service/services/EventsService";

export class ServiceApi {
  private readonly db: DBClient;
  private readonly auth: RoleBasedAccessHandler;
  private readonly policy: AuthorizationService;
  public readonly participations: ParticipationsService;
  public readonly userClient: UserService;
  public readonly session: SessionService;
  public readonly groups: GroupManagementService;
  public readonly events: EventsService;
  constructor() {
    this.db = new DBClient(db);
    this.auth = new RoleBasedAccessHandler(this.db);
    this.policy = new AuthorizationService(this.auth);
    this.session = new SessionService(this.db, this.policy);
    this.participations = new ParticipationsService(this.db, this.policy);
    this.userClient = new UserService(this.db, this.policy);
    this.groups = new GroupManagementService(this.db, this.policy);
    this.events = new EventsService(this.db, this.policy);
  }
}
