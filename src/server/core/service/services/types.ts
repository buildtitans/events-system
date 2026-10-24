import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import {
  NotificationSchemaType,
  UserNotificationsSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";
import { IDBClient } from "@/src/server/core/db/access/client/dbClient";
import {
  AuthClientLoginResponse,
  NewUserResponse,
} from "@/src/server/core/db/access/types/types";
import {
  IEventLayoutHandler,
  IEventLifecycleHandler,
  IEventQueryHandler,
} from "../handlers/events/types";
import {
  IGroupLifecycleHandler,
  IGroupQueryHandler,
  IMembershipHandler,
} from "../handlers/groups/types";
import type { RecoveredSessionSchemaType } from "@/src/schemas/auth/recoveredSessionSchema";
import { IUserSelectHandler } from "../handlers/user/userSelectHandler";
import { IUserWriteHandler } from "../handlers/user/userWriteHandler";
import { LoginCredentialsSchemaType } from "../../../../schemas/auth/loginCredentialsSchema";
import { IGroupHydrationHandler } from "../handlers/groups/groupHydrationHandler";

export type SessionServiceDb = Pick<IDBClient, "auth">;

export type UserServiceDb = Pick<
  IDBClient,
  "groups" | "groupMembers" | "auth" | "eventAttendants"
>;

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
  readonly query: IEventQueryHandler;
  readonly layout: IEventLayoutHandler;
  readonly lifecycle: IEventLifecycleHandler;
}

export interface IGroupService {
  readonly groupLifecycle: IGroupLifecycleHandler;
  readonly memberships: IMembershipHandler;
  readonly query: IGroupQueryHandler;
  readonly hydrate: IGroupHydrationHandler;
}

export interface INotificationService {
  getNotifications(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UserNotificationsSchemaType>;
  createNotification(
    notification: NewNotification,
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UserNotificationsSchemaType["new"][number] | undefined>;
  markSeen(
    user_id: AuthenticatedUserId | undefined | null,
    ids: NotificationSchemaType["id"][],
  ): Promise<{ ok: true; numUpdated: number } | { ok: false; error: string }>;
}

export interface ISessionService {
  signUp(credentials: LoginCredentialsSchemaType): Promise<NewUserResponse>;
  login(
    emailInput: string,
    passwordInput: string,
  ): Promise<AuthClientLoginResponse>;
  logout(token: string | undefined): Promise<boolean>;
  recoverSession(
    token: string | undefined | null,
  ): Promise<RecoveredSessionSchemaType>;
  resetPassword(token: string, password: string): Promise<{ ok: true }>;
  emailForPwReset(email: string): Promise<{
    ok: true;
  }>;
}

export interface IUserService {
  readonly select: IUserSelectHandler;
  readonly write: IUserWriteHandler;
}
