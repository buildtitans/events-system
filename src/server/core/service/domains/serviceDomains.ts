import { UserService } from "@/src/server/core/service/services/userService";
import { GroupService } from "@/src/server/core/service/services/groupService";
import { IAuthorization } from "@/src/server/core/service/auth/authorization";
import { SessionService } from "@/src/server/core/service/services/SessionService";
import { EventService } from "@/src/server/core/service/services/EventService";
import { NotificationService } from "@/src/server/core/service/services/notificationService";
import {
  IEventService,
  IGroupService,
  INotificationService,
  IPasswordResetEmailService,
  ISessionService,
  IUserService,
} from "../services/types";
import { IServiceDomains } from "./types";
import { IDBClient } from "../../db/access/client/dbClient";
import { ISearchService, SearchService } from "../services/searchService";

export class ServiceDomains implements IServiceDomains {
  public readonly users: IUserService;
  public readonly session: ISessionService;
  public readonly groups: IGroupService;
  public readonly events: IEventService;
  public readonly notifications: INotificationService;
  public readonly query: ISearchService;
  constructor(
    private readonly db: IDBClient,
    private readonly policy: IAuthorization,
    private readonly emailer: IPasswordResetEmailService,
  ) {
    this.session = new SessionService(this.db, this.policy, this.emailer);
    this.users = new UserService(this.db, this.policy);
    this.groups = new GroupService(this.db, this.policy);
    this.events = new EventService(this.db, this.policy);
    this.notifications = new NotificationService(this.db, this.policy);
    this.query = new SearchService(this.db);
  }
}
