import { DBClient } from "../../db";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { GroupAction, Permissions } from "../types";
import { permissionsConfig } from "../../lib/config/permissionsConfig";

export class RoleBasedAccessHandler {
  private readonly permissions: Permissions;
  constructor(private readonly db: DBClient) {
    this.permissions = permissionsConfig;
  }

  async can(
    user_id: GroupMemberSchemaType["user_id"] | undefined,
    group_id: GroupMemberSchemaType["group_id"],
    action: GroupAction,
  ) {
    if (!user_id) return false;

    const role = await this.getRoleInGroup(user_id, group_id);
    return this.checkPermission(action, role);
  }

  private async getRoleInGroup(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ) {
    return await this.db.groupMembers.select.role(user_id, group_id);
  }

  private checkPermission(
    action: GroupAction,
    role: GroupMemberSchemaType["role"],
  ): boolean {
    const permittedActions = this.permissions[role];

    return permittedActions.includes(action);
  }
}
