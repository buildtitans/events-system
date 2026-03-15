import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

export type RoleBySlug = Record<
  GroupSchemaType["slug"],
  GroupMemberSchemaType["role"]
>;

export function buildRoleBySlugLookup(
  groups: GroupSchemaType[],
  memberships: GroupMemberSchemaType[] | null | undefined,
): RoleBySlug {
  const lookup = {} as RoleBySlug;
  const slugByGroupId = new Map<
    GroupMemberSchemaType["group_id"],
    GroupSchemaType["slug"]
  >();

  for (const group of groups) {
    lookup[group.slug] = "anonymous";
    slugByGroupId.set(group.id, group.slug);
  }

  if (!memberships) {
    return lookup;
  }

  for (const membership of memberships) {
    const slug = slugByGroupId.get(membership.group_id);
    if (slug) {
      lookup[slug] = membership.role;
    }
  }

  return lookup;
}
