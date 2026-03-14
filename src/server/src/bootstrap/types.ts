import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { RBACType } from "../db/clients/types/types";
import type { AttendanceDictionaryType } from "../lib/utils/mapAttendanceDictionary";

export type RBACAction =
  | "create event"
  | "cancel event"
  | "update event"
  | "leave group"
  | "join group";

export type RBACMethods = {
  can: (
    action: RBACAction,
    group_id: GroupSchemaType["id"],
    roles: RBACType,
  ) => boolean;
  getRoleForGroup: (
    groupId: GroupSchemaType["id"],
    roles: RBACType,
  ) => GroupMemberSchemaType["role"];
};

export type ContextCacheType = {
  roleLookupMap: RBACType;
  attendanceDictionary: AttendanceDictionaryType;
};
