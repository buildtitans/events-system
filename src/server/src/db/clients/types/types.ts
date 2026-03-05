import type {
  PublicUserSchemaType,
  DbUserSchemaType,
} from "@/src/schemas/auth/userSchema";
import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import type { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";

type StoredSession = {
  id: string;
  expires_at: Date;
  user_id: string;
};

type AuthClientLoginResponse = {
  user: PublicUserSchemaType;
  session: StoredSession;
};

type NotificationCreationProcedure = {
  ok: boolean;
  items: NotificationSchemaArrayType;
};

type NewUserResponse = Pick<DbUserSchemaType, "email" | "id">;

type RBACType = Record<
  GroupMembersSchemaType["group_id"],
  GroupMembersSchemaType["role"]
>;

export type {
  StoredSession,
  AuthClientLoginResponse,
  NotificationCreationProcedure,
  NewUserResponse,
  RBACType,
};
