import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../db";
import { FastifyRequest } from "fastify";
import type { RBACContextType, RBACAction } from "./types";
import { buildCache } from "./buildCache";

export async function buildRequestContext(
  api: DBClient,
  user: FastifyRequest["user"] | undefined,
): Promise<RBACContextType> {
  const { roles, attendanceDict } = await buildCache(api, user?.id);

  function getRoleForGroup(
    group_id: GroupSchemaType["id"],
  ): GroupMembersSchemaType["role"] {
    const userRole = roles[group_id];
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
