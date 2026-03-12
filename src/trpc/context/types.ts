import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";

export type RBACType = Record<
  GroupMembersSchemaType["group_id"],
  GroupMembersSchemaType["role"]
>;

export type RBACAction =
  | "create event"
  | "cancel event"
  | "update event"
  | "leave group"
  | "join group";

export type RBACMethods = {
  can: (
    user_id: string | undefined,
    action: RBACAction,
    group_id: GroupSchemaType["id"],
    roles: RBACType,
  ) => boolean;
  getRoleForGroup: (
    groupId: GroupSchemaType["id"],
    roles: RBACType,
  ) => GroupMembersSchemaType["role"];
};

export type ContextCacheType = {
  roleLookupMap: RBACType;
  attendanceDictionary: AttendanceDictionaryType;
};

export type ServicesType = {
  getNumberOfAttendantsForEvent: (
    event_id: EventSchemaType["id"],
  ) => Promise<{ numGoing: number; numInterested: number }>;
  getEmailById: (
    user_id: DbUserSchemaType["id"],
  ) => Promise<DbUserSchemaType["email"]>;
  getGroupsCreated: (
    user_id: DbUserSchemaType["id"],
  ) => Promise<GroupsSchemaType>;
  getRSVPdEvents: (
    user_id: DbUserSchemaType["id"],
  ) => Promise<EventsArraySchemaType>;
};
