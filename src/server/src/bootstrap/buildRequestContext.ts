import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { FastifyRequest } from "fastify";
import type { RBACAction, RBACMethods } from "./types";
import { RBACType } from "../db/clients/types/types";

export async function buildAuthContext(
  user: FastifyRequest["user"] | undefined,
): Promise<RBACMethods> {
  function getRoleForGroup(
    group_id: GroupSchemaType["id"],
    roles: RBACType,
  ): GroupMembersSchemaType["role"] {
    const userRole = roles[group_id];
    return userRole;
  }

  function can(
    action: RBACAction,
    group_id: GroupSchemaType["id"],
    roles: RBACType,
  ): boolean {
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
    can,
    getRoleForGroup,
  };
}
