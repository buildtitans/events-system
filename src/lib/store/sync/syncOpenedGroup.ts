import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { EventsPages } from "../slices/events/types";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

export type SyncOpenGroupPayload = {
  group: GroupSchemaType | null;
  events: EventsPages;
  role: GroupMembersSchemaType["role"];
  numMembers: number;
  organizer?: GroupMembersSchemaType;
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
        numMembers: 0,
      };
    }

    const events = (await trpcClient.events.groupEvents.mutate(group.id)) ?? [];

    const members = await trpcClient.groupMembers.getGroupMembers.mutate(
      group.id,
    );

    const organizer = members.find(
      (member) => member.role === "organizer",
    ) as GroupMembersSchemaType;

    return {
      group,
      events,
      role,
      numMembers: members.length,
      organizer,
    };
  } catch (err) {
    console.error(err);
    return {
      group: null,
      events: [],
      role: "anonymous",
      numMembers: 0,
    };
  }
}
