import { DbUserSchemaType } from "../../../../schemas/auth/userSchema";
import { GroupSchemaType } from "../../../../schemas/groups/groupSchema";
import { UserMembershipSchemaType } from "../../../../schemas/groups/userMembershipSchema";
import { NotificationSchemaType } from "../../../../schemas/notifications/notificationsSchema";
import {
  AuthClientLoginResponse,
  NewUserResponse,
  NotificationCreationProcedure,
  StoredSession,
} from "../../db/access/types/types";
import {
  IEventHydrationHandler,
  IEventLayoutHandler,
  IEventLifecycleHandler,
  IEventQueryHandler,
  IEventTimelineHandler,
} from "../handlers/events/types";
import {
  IGroupLifecycleHandler,
  IGroupQueryHandler,
  IMembershipHandler,
} from "../handlers/groups/types";
import { ICensusHandler, IRsvpHandler } from "../handlers/participations/types";
import { NewNotification } from "./notificationService";

export interface IEventService {
  readonly hydrate: IEventHydrationHandler;
  readonly query: IEventQueryHandler;
  readonly timeline: IEventTimelineHandler;
  readonly layout: IEventLayoutHandler;
  readonly lifecycle: IEventLifecycleHandler;
}

export interface IGroupService {
  readonly groupLifecycle: IGroupLifecycleHandler;
  readonly memberships: IMembershipHandler;
  readonly query: IGroupQueryHandler;
}

export interface IParticipationsService {
  readonly census: ICensusHandler;
  readonly rsvps: IRsvpHandler;
}

export interface INotificationService {
  getNewNotifications(
    user_id: string | null | undefined,
  ): Promise<NotificationSchemaType[]>;
  createNotification(
    notification: NewNotification,
    user_id: string | undefined | null,
  ): Promise<NotificationCreationProcedure>;
  markSeen(
    user_id: string | null | undefined,
    seenNotifications: NotificationSchemaType[],
  ): Promise<{ ok: true; numUpdated: number } | { ok: false; error: string }>;
}

export interface ISessionService {
  login(
    emailInput: string,
    passwordInput: string,
  ): Promise<AuthClientLoginResponse>;
  logout(token: string | undefined): Promise<boolean>;
  recoverSession(
    token: string | undefined | null,
  ): Promise<StoredSession | undefined>;
  resetPassword(token: string, password: string): Promise<{ ok: true }>;
  emailForPwReset(email: string): Promise<{
    ok: true;
  }>;
}

export interface IUserService {
  createNewUser(
    emailInput: string,
    passwordInput: string,
  ): Promise<NewUserResponse>;
  getGroupsCreated(
    user_id: string | null | undefined,
  ): Promise<GroupSchemaType[][]>;
  getEmailById(
    user_id: string | null | undefined,
  ): Promise<DbUserSchemaType["email"]>;
  getMemberships(
    user_id: string | null | undefined,
  ): Promise<UserMembershipSchemaType[]>;
}
