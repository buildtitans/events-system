import { ProxyClient } from "../proxyClient";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { RBACType } from "@/src/server/src/db/clients/types/types";

export class PermissionCheck {
  constructor(private readonly api: ProxyClient) {}

  async getRoleLookup(user_id: string | undefined) {
    const memberships = await this.api.auth.getMemberships(user_id);
    const ids: GroupSchemaType["id"][] = []; //placeholder
    return this.mapRoleBasedAccessControls(ids, memberships);
  }

  private mapRoleBasedAccessControls(
    ids: GroupSchemaType["id"][],
    memberships: GroupMembersSchemaType[] | null | undefined,
  ): RBACType {
    const accessPermissions: RBACType = {};

    ids.forEach((id) => {
      accessPermissions[`${id}`] = "anonymous";
    });

    memberships?.forEach((membership) => {
      accessPermissions[`${membership.group_id}`] = membership.role;
    });
    return accessPermissions;
  }
}
