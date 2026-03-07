import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { RBACType } from "../../db/clients/types/types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export function mapRoleBasedAccessControls(
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
