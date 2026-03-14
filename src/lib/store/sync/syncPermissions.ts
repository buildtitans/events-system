import { RBACType } from "@/src/server/src/db/clients/types/types";
import { mapGroupAccessPermissions } from "../../tokens/accessPermissions";
import type { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

function handlePermissions(
  groups: GroupsSchemaType,
  memberships: GroupMemberSchemaType[] | null,
) {
  const permissions = mapGroupAccessPermissions(groups, memberships);

  return permissions;
}

export async function syncPermissions(): Promise<RBACType> {
  const groups = await trpcClient.groups.list.mutate();
  const memberships = await trpcClient.groupMembers.viewerMemberships.mutate();
  return handlePermissions(groups, memberships);
}
