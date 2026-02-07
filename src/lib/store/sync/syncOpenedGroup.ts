import { store } from "../root/store";
import { EventsPages } from "../slices/EventsSlice";
import {
    getGroupEvents,
    groupOpened,
    syncOpenedGroupStatus
} from "../slices/groups/OpenedGroupSlice";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

function hydrateGroup(
    group: GroupSchemaType,
    events: EventsPages | null | undefined
) {
    store.dispatch(groupOpened(group));

    if (events) store.dispatch(getGroupEvents(events));

    store.dispatch(syncOpenedGroupStatus("idle"))
};

export async function syncOpenedGroup(slug: GroupSchemaType["slug"]): Promise<void> {
    store.dispatch(syncOpenedGroupStatus("pending"));

    try {
        const group = await trpcClient.groups.groupBySlug.mutate(slug);
        const events = await trpcClient.events.groupEvents.mutate(group.id);

        hydrateGroup(group, events);
    } catch (err) {
        console.error(err);
        store.dispatch(syncOpenedGroupStatus("failed"));
    }
}