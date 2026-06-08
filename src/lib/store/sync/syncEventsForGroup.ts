import { trpcClient } from "@/src/trpc/trpcClient";
import type { EventsPages } from "../slices/events/types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export async function syncEventsForGroup(
  group_id: GroupSchemaType["id"],
): Promise<EventsPages> {
  return await trpcClient.events.groupEventsLayout.mutate(group_id);
}
