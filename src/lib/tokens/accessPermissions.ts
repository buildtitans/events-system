import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import type { RBACType } from "@/src/server/src/db/clients/types/types";

export const mapGroupAccessPermissions = (
  groups: GroupsSchemaType,
  memberships: GroupMemberSchemaType[] | null,
): RBACType => {
  const accessPermissions: RBACType = {};

  groups.forEach((group) => {
    accessPermissions[`${group.id}`] = "anonymous";
  });

  memberships?.forEach((membership) => {
    accessPermissions[`${membership.group_id}`] = membership.role;
  });

  return accessPermissions;
};
