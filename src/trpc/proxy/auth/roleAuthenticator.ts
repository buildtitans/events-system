import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { RBACAction, RBACType } from "../../context/types";
import { ProxyClient } from "../proxyClient";
import { PermissionCheck } from "./permissionCheck";

export class RoleAuthenticator {
  private readonly permissions: PermissionCheck;
  constructor(
    private readonly user_id: string | undefined,
    private readonly api: ProxyClient,
  ) {
    this.permissions = new PermissionCheck(this.api);
  }

  getRoleForGroup(
    group_id: GroupSchemaType["id"],
    roles: RBACType,
  ): GroupMembersSchemaType["role"] {
    const userRole = roles[group_id];
    return userRole;
  }

  async can(action: RBACAction, group_id: GroupSchemaType["id"]) {
    const roles = await this.permissions.getRoleLookup(this.user_id);

    if (!this.user_id) {
      return false;
    }

    return this.checkPermission(action, group_id, roles);
  }

  private checkPermission(
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
        if (roles[group_id] === "anonymous") {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}
