import { EventsPages } from "../slices/events/EventsSlice";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

export type SyncOpenGroupPayload = {
    group: GroupSchemaType | null,
    events: EventsPages
};

export async function syncOpenedGroup(
    slug: GroupSchemaType["slug"]
): Promise<SyncOpenGroupPayload> {

    try {
        const group = await trpcClient
            .groups
            .groupBySlug
            .mutate(slug);

        if (!group) {
            return {
                group: null,
                events: []
            }
        }

        const events = await trpcClient
            .events
            .groupEvents
            .mutate(group.id) ?? [];

        return {
            group,
            events
        }

    } catch (err) {
        console.error(err)
        return {
            group: null,
            events: []
        }
    }
};