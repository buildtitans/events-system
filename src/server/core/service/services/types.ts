import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { UserMembershipSurfaceSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { IDBClient } from "@/src/server/core/db/access/client/dbClient";
import {
  AuthClientLoginResponse,
  NewUserResponse,
  StoredSession,
} from "@/src/server/core/db/access/types/types";
import {
  IEventHydrationHandler,
  IEventLayoutHandler,
  IEventLifecycleHandler,
  IEventQueryHandler,
} from "../handlers/events/types";
import {
  IGroupLifecycleHandler,
  IGroupQueryHandler,
  IMembershipHandler,
} from "../handlers/groups/types";
import { ICensusHandler, IRsvpHandler } from "../handlers/participations/types";
import { IUserSelectHandler } from "../handlers/user/userSelectHandler";
import { IUserWriteHandler } from "../handlers/user/userWriteHandler";
import { LoginCredentialsSchemaType } from "../../../../schemas/auth/loginCredentialsSchema";
import { IGroupHydrationHandler } from "../handlers/groups/groupHydrationHandler";

export type SessionServiceDb = Pick<IDBClient, "auth">;

export type ParticipationsServiceDb = Pick<
  IDBClient,
  "eventAttendants" | "groupMembers" | "groups" | "events"
>;

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
  readonly hydrate: IEventHydrationHandler;
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

export interface IParticipationsService {
  readonly census: ICensusHandler;
  readonly attendance: IRsvpHandler;
}

export interface INotificationService {
  getNotifications(user_id: AuthenticatedUserId | undefined | null): Promise<{
    new: NotificationSchemaType[];
    seen: NotificationSchemaType[];
  }>;
  createNotification(
    notification: NewNotification,
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<NotificationSchemaType | undefined>;
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
  ): Promise<StoredSession | undefined>;
  resetPassword(token: string, password: string): Promise<{ ok: true }>;
  emailForPwReset(email: string): Promise<{
    ok: true;
  }>;
}

export interface IUserService {
  readonly select: IUserSelectHandler;
  readonly write: IUserWriteHandler;
}
