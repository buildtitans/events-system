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
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";

type RBACAction =
  | "create event"
  | "cancel event"
  | "update event"
  | "leave group"
  | "join group";

type RBACServices = {
  can: (action: RBACAction, group_id: GroupSchemaType["id"]) => boolean;
  getRoleForGroup: (
    groupId: GroupSchemaType["id"],
  ) => GroupMembersSchemaType["role"];
  getNumberOfAttendantsForEvent: (
    event_id: EventSchemaType["id"],
  ) => Promise<{ numGoing: number; numInterested: number }>;
  getEmailById: (
    user_id: DbUserSchemaType["id"],
  ) => Promise<DbUserSchemaType["email"]>;
};

type RBACCacheType = {
  roleLookupMap: RBACType;
  attendanceDictionary: AttendanceDictionaryType;
};

export type RBACContextType = {
  cache: RBACCacheType;
  rbac: RBACServices;
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

  console.log({
    User: user,
    Roles: roles,
  });

  async function getEmailById(
    user_id: DbUserSchemaType["id"],
  ): Promise<DbUserSchemaType["email"]> {
    const { email } = await api.auth.getEmailByUserId(user_id);

    return email;
  }

  function getRoleForGroup(
    group_id: GroupSchemaType["id"],
  ): GroupMembersSchemaType["role"] {
    const userRole = roles[group_id];
    console.log({ "Role from service layer": userRole });

    return userRole;
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

      case "leave group": {
        if (roles[group_id] === "member") {
          return true;
        } else {
          return false;
        }
      }

      case "join group": {
        if (roles[group_id] === "anonymous" && user?.id) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  async function getNumberOfAttendantsForEvent(
    event_id: EventSchemaType["id"],
  ): Promise<{ numGoing: number; numInterested: number }> {
    const attendants = await api.eventAttendants.getAttendants(event_id);

    const filteredGoing = attendants.filter(
      (attendant) => attendant.status === "going",
    );

    const filteredInterested = attendants.filter(
      (attendant) => attendant.status === "interested",
    );

    return {
      numGoing: filteredGoing.length,
      numInterested: filteredInterested.length,
    };
  }

  return {
    cache: {
      roleLookupMap: roles,
      attendanceDictionary: attendanceDict,
    },
    rbac: {
      can,
      getRoleForGroup,
      getNumberOfAttendantsForEvent,
      getEmailById,
    },
  };
}
