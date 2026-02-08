import { EventsPages } from "../slices/EventsSlice";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

export type SyncOpenGroupPayload = {
    group: GroupSchemaType,
    events: EventsPages
};

export async function syncOpenedGroup(slug: GroupSchemaType["slug"]): Promise<SyncOpenGroupPayload> {

    const group = await trpcClient
        .groups
        .groupBySlug
        .mutate(slug);

    const events = await trpcClient
        .events
        .groupEvents
        .mutate(group.id) ?? [];

    return {
        group,
        events
    }

}