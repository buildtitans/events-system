import { RBACType } from "../db/clients/types/types";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../db";
import { FastifyRequest } from "fastify";
import { mapRoleBasedAccessControls } from "../lib/utils/mapRoleBasedAccessControls";

type RBACAction = "create event" | "cancel event" | "update event";

type RBACMethods = {
  can: (action: RBACAction, group_id: GroupSchemaType["id"]) => boolean;
  getRoleForGroup: (
    groupId: GroupSchemaType["id"],
  ) => GroupMembersSchemaType["role"];
};

type RBACCacheType = {
  roleLookupMap: RBACType;
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
  const memberships = user?.id
    ? await api.groupMembers.getViewerMemberships(user.id)
    : null;

  const ids = groups.map((grp) => grp.id);
  const roles = mapRoleBasedAccessControls(ids, memberships);

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
    },
    rbac: {
      can,
      getRoleForGroup,
    },
  };
}
