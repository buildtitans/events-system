import { RBACType } from "../db/clients/types/types";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../db";
import { FastifyRequest } from "fastify";
import { mapRoleBasedAccessControls } from "../lib/utils/mapRoleBasedAccessControls";
import {
  mapAttendanceDictionary,
  type AttendanceDictionaryType,
} from "../lib/utils/mapAttendanceDictionary";

type RBACAction = "create event" | "cancel event" | "update event";

type RBACMethods = {
  can: (action: RBACAction, group_id: GroupSchemaType["id"]) => boolean;
  getRoleForGroup: (
    groupId: GroupSchemaType["id"],
  ) => GroupMembersSchemaType["role"];
};

type RBACCacheType = {
  roleLookupMap: RBACType;
  attendanceDictionary: AttendanceDictionaryType;
};

export type RBACContextType = {
  cache: RBACCacheType;
  rbac: RBACMethods;
};

export async function buildRbacContext(
  api: DBClient,
  user: FastifyRequest["user"] | null,
): Promise<RBACContextType> {
  const groups = await api.groups.getGroups();
  const events = await api.events.getFlattenedEvents();
  const memberships = user?.id
    ? await api.groupMembers.getViewerMemberships(user.id)
    : null;

  const attendance = user?.id
    ? await api.eventAttendants.getUserAttendanceRecords(user?.id)
    : [];

  const eventIds = events.map((ev) => ev.id);
  const groupIds = groups.map((grp) => grp.id);
  const roles = mapRoleBasedAccessControls(groupIds, memberships);
  const attendanceDict = mapAttendanceDictionary(eventIds, attendance);

  console.dir({
    cached: {
      Roles: roles,
      Attendance: attendanceDict,
    },
  });

  function getRoleForGroup(
    group_id: GroupSchemaType["id"],
  ): GroupMembersSchemaType["role"] {
    return roles[group_id];
  }

  function can(action: RBACAction, group_id: GroupSchemaType["id"]): boolean {
    switch (action) {
      case "create event":
      case "cancel event":
      case "update event": {
        if (roles[group_id] === "organizer") {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  return {
    cache: {
      roleLookupMap: roles,
      attendanceDictionary: attendanceDict,
    },
    rbac: {
      can,
      getRoleForGroup,
    },
  };
}
