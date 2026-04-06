import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { EventsPages } from "../slices/events/types";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

export type SyncOpenGroupPayload = {
  group: GroupSchemaType | null;
  events: EventsPages;
  role: GroupMemberSchemaType["role"];
  numMembers: number;
  organizerEmail: string;
  allGroupEvents: EventSchemaType[];
};

export async function syncOpenedGroup(
  slug: GroupSchemaType["slug"],
): Promise<SyncOpenGroupPayload> {
  try {
    const group = await trpcClient.groups.groupBySlug.mutate(slug);

    const role = await trpcClient.groupMembers.getViewerRole.mutate(group.id);

    if (!group) {
      return {
        group: null,
        events: [],
        role: "anonymous",
        numMembers: 0,
        organizerEmail: "",
        allGroupEvents: [],
      };
    }

    const events =
      (await trpcClient.events.groupEventsLayout.mutate(group.id)) ?? [];

    const members = await trpcClient.groupMembers.getGroupMembers.mutate(
      group.id,
    );

    const allGroupEvents =
      await trpcClient.events.getFlattenedGroupEvents.mutate(group.id);

    const { email } =
      await trpcClient.groupMembers.getGroupOrganizerEmail.mutate(group?.id);

    return {
      group,
      events,
      role,
      numMembers: members.length,
      organizerEmail: email,
      allGroupEvents,
    };
  } catch (err) {
    console.error(err);
    return {
      group: null,
      events: [],
      role: "anonymous",
      numMembers: 0,
      organizerEmail: "",
      allGroupEvents: [],
    };
  }
}
