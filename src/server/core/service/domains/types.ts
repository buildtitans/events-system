import {
  IEventService,
  IGroupService,
  INotificationService,
  IParticipationsService,
  ISessionService,
  IUserService,
} from "../services/types";

export interface IServiceDomains {
  readonly users: IUserService;
  readonly session: ISessionService;
  readonly groups: IGroupService;
  readonly events: IEventService;
  readonly notifications: INotificationService;
}
