import { DbUserSchemaType } from "../../../../schemas/auth/userSchema";
import { GroupSchemaType } from "../../../../schemas/groups/groupSchema";
import { UserMembershipSchemaType } from "../../../../schemas/groups/userMembershipSchema";
import { NotificationSchemaType } from "../../../../schemas/notifications/notificationsSchema";
import { IDBClient } from "../../db/access/client/dbClient";
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

export type SessionServiceDb = Pick<IDBClient, "auth">;

export type ParticipationsServiceDb = Pick<
  IDBClient,
  "eventAttendants" | "groupMembers" | "groups" | "events"
>;

export type UserServiceDb = Pick<IDBClient, "groups" | "groupMembers" | "auth">;

export type GroupServiceDb = IDBClient;

export type EventServiceDB = Pick<
  IDBClient,
  "eventAttendants" | "events" | "groupMembers" | "groups"
>;

export type PasswordResetEmailServiceDB = Pick<IDBClient, "auth">;

export type NotificationServiceDB = Pick<
  IDBClient,
  "notifications" | "groupMembers"
>;

export type NewNotification = Pick<
  NotificationSchemaType,
  "group_id" | "priority" | "message" | "subject"
>;

export interface IPasswordResetEmailService {
  request(email: string): Promise<{ ok: true }>;
}

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
  getNotifications(user_id: string | null | undefined): Promise<{
    new: NotificationSchemaType[];
    seen: NotificationSchemaType[];
  }>;
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
