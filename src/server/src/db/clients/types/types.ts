import type {
  PublicUserSchemaType,
  DbUserSchemaType,
} from "@/src/schemas/auth/userSchema";
import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

type StoredSession = {
  id: string;
  expires_at: Date;
  user_id: string;
};

type SessionType =
  | {
      token: string;
      expires_at: Date;
      user_id: string;
    }
  | undefined;

type AuthClientLoginResponse = {
  ok: boolean;
  user: PublicUserSchemaType;
  session: StoredSession;
};

type NotificationCreationProcedure = {
  ok: boolean;
  items: NotificationSchemaArrayType;
};

type NewUserResponse = Pick<DbUserSchemaType, "email" | "id">;

type RBACType = Record<
  GroupMemberSchemaType["group_id"],
  GroupMemberSchemaType["role"]
>;

export type {
  StoredSession,
  SessionType,
  AuthClientLoginResponse,
  NotificationCreationProcedure,
  NewUserResponse,
  RBACType,
};
