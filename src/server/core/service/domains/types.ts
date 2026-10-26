import { ISearchService } from "../services/searchService";
import {
  IEventService,
  IGroupService,
  INotificationService,
  ISessionService,
  IUserService,
} from "../services/types";

export interface IServiceDomains {
  readonly users: IUserService;
  readonly session: ISessionService;
  readonly groups: IGroupService;
  readonly events: IEventService;
  readonly notifications: INotificationService;
  readonly query: ISearchService;
}
