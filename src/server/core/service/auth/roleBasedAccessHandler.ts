import { DBClient } from "../../db";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { RBACAction } from "../../bootstrap/types";
import type { GroupAction } from "../types";

export class RoleBasedAccessHandler {
  constructor(private readonly db: DBClient) {}

  async can(
    user_id: GroupMemberSchemaType["user_id"] | undefined,
    group_id: GroupMemberSchemaType["group_id"],
    action: GroupAction,
  ) {
    if (!user_id) return false;

    const role = await this.getRoleInGroup(user_id, group_id);
    return this.rolePermission(role, action);
  }

  private async getRoleInGroup(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ) {
    return await this.db.groupMembers.getMembershipRole(user_id, group_id);
  }

  private rolePermission(
    role: GroupMemberSchemaType["role"],
    action: GroupAction,
  ) {
    switch (action) {
      case "manage group": {
        if (role === "organizer") {
          return true;
        } else {
          return false;
        }
      }
      case "manage events": {
        if (role === "organizer") {
          return true;
        } else {
          return false;
        }
      }
      case "change membership": {
        if (role === "anonymous" || role === "member") {
          return true;
        } else {
          return false;
        }
      }

      case "read or receive notifications": {
        if (role === "member" || role === "organizer") {
          return true;
        } else {
          return false;
        }
      }

      default: {
        return false;
      }
    }
  }

  private checkPermission(
    action: RBACAction,
    role: GroupMemberSchemaType["role"],
  ): boolean {
    switch (action) {
      case "create event":
      case "cancel event":
      case "update event": {
        if (role === "organizer") {
          return true;
        } else {
          return false;
        }
      }

      case "leave group": {
        if (role === "member") {
          return true;
        } else {
          return false;
        }
      }

      case "join group": {
        if (role === "anonymous") {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}
