import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { GroupAction, Permissions } from "@/src/server/core/service/types";
import { permissionsConfig } from "@/src/server/core/lib/config/permissionsConfig";
import { IDBClient } from "@/src/server/core/db/access/client/dbClient";

type RbacDB = Pick<IDBClient, "groupMembers">;

export interface IRoleBasedAccessHandler {
  can(
    user_id: GroupMemberSchemaType["user_id"] | undefined,
    group_id: GroupMemberSchemaType["group_id"],
    action: GroupAction,
  ): Promise<boolean>;
}

export class RoleBasedAccessHandler implements IRoleBasedAccessHandler {
  private readonly permissions: Permissions;
  constructor(private readonly db: RbacDB) {
    this.permissions = permissionsConfig;
  }

  async can(
    user_id: GroupMemberSchemaType["user_id"] | undefined,
    group_id: GroupMemberSchemaType["group_id"],
    action: GroupAction,
  ): Promise<boolean> {
    if (!user_id) return false;

    const role = await this.getRoleInGroup(user_id, group_id);
    return this.checkPermission(action, role);
  }

  private async getRoleInGroup(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["role"]> {
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
