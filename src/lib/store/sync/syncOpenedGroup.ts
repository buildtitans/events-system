import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { EventsPages } from "../slices/events/types";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

export type SyncOpenGroupPayload = {
  group: GroupSchemaType | null;
  events: EventsPages;
  role: GroupMembersSchemaType["role"];
};

export async function syncOpenedGroup(
  slug: GroupSchemaType["slug"],
): Promise<SyncOpenGroupPayload> {
  try {
    const { group, role } = await trpcClient.groups.groupBySlug.mutate(slug);

    if (!group) {
      return {
        group: null,
        events: [],
        role: "anonymous",
      };
    }

    const events = (await trpcClient.events.groupEvents.mutate(group.id)) ?? [];

    return {
      group,
      events,
      role,
    };
  } catch (err) {
    console.error(err);
    return {
      group: null,
      events: [],
      role: "anonymous",
    };
  }
}
