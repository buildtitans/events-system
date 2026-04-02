import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type NameSlugDescriptionLookup = Record<
  GroupSchemaType["id"],
  {
    name: GroupSchemaType["name"];
    slug: GroupSchemaType["slug"];
    group_description: GroupSchemaType["description"];
  }
>;

export function buildGroupNameLookup(
  groups: GroupSchemaType[],
): NameSlugDescriptionLookup {
  const lookup: NameSlugDescriptionLookup = {};

  for (const group of groups) {
    lookup[group.id] = {
      name: group.name,
      slug: group.slug,
      group_description: group.description,
    };
  }

  return lookup;
}
