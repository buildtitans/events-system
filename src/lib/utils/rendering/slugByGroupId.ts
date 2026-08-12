import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";

type SlugByGroupIdLookup = Partial<
  Record<NotificationSchemaType["group_id"], GroupSchemaType["slug"]>
>;

type SlugByGroupIdParams = {
  groups: GroupSchemaType[];
  notifications: NotificationSchemaType[];
};

export function slugByGroupId({
  groups,
  notifications,
}: SlugByGroupIdParams): SlugByGroupIdLookup {
  const lookup: SlugByGroupIdLookup = {};

  for (let i = 0; i < notifications.length; i++) {
    const current = notifications[i].group_id;
    const slug = findGroupSlug(current, groups);

    if (slug === undefined) continue;

    lookup[current] = slug;
  }

  return lookup satisfies SlugByGroupIdLookup;
}

function findGroupSlug(
  group_id: NotificationSchemaType["group_id"],
  groups: SlugByGroupIdParams["groups"],
): GroupSchemaType["slug"] | undefined {
  const group = groups.find((group) => group.id === group_id);

  if (group?.slug) {
    return group.slug;
  } else {
    return undefined;
  }
}
