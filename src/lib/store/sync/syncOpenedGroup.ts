import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { EventsPages } from "../slices/events/types";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { logCaughtError } from "../../utils/errors/logCaughtError";

export type SyncOpenGroupPayload =
  | {
      ok: true;
      data: OpenedGroupPayload;
    }
  | {
      ok: false;
      error: "Failed to hydrate group selected";
    };

export type OpenedGroupPayload = {
  group: GroupSchemaType;
  events: EventsPages;
  role: GroupMemberSchemaType["role"];
  numMembers: number;
  organizerEmail: string;
  allGroupEvents: EventSchemaType[];
};

function createEmptyOpenGroupPayload(): SyncOpenGroupPayload {
  return {
    ok: false,
    error: "Failed to hydrate group selected",
  };
}

export async function syncOpenedGroup(
  slug: GroupSchemaType["slug"],
): Promise<SyncOpenGroupPayload> {
  try {
    const group = await trpcClient.groups.groupBySlug.mutate(slug);

    if (!group) {
      return createEmptyOpenGroupPayload();
    }

    const role = await trpcClient.groupMembers.getViewerRole.mutate(group.id);

    const events =
      (await trpcClient.events.groupEventsLayout.mutate(group.id)) ?? [];

    const members = await trpcClient.groupMembers.getGroupMembers.mutate(
      group.id,
    );

    const allGroupEvents =
      await trpcClient.events.getFlattenedGroupEvents.mutate(group.id);

    const { email } =
      await trpcClient.groupMembers.getGroupOrganizerEmail.mutate(group.id);

    return {
      ok: true,
      data: {
        group,
        events,
        role,
        numMembers: members.length,
        organizerEmail: email,
        allGroupEvents,
      },
    };
  } catch (err) {
    logCaughtError("sync/syncOpenedGroup", err);
    return createEmptyOpenGroupPayload();
  }
}
