import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { RBACType } from "../../db/clients/types/types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export function mapRoleBasedAccessControls(
  groups: GroupSchemaType[],
  memberships: GroupMemberSchemaType[] | null | undefined,
): RBACType {
  const accessPermissions: RBACType = {};

  const ids = groups.map((group) => group.id);

  ids.forEach((id) => {
    accessPermissions[`${id}`] = "anonymous";
  });

  memberships?.forEach((membership) => {
    accessPermissions[`${membership.group_id}`] = membership.role;
  });
  return accessPermissions;
}
