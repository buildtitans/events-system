import { trpcClient } from "@/src/trpc/trpcClient";
import type { EventsPages } from "../slices/events/EventsSlice";
import { GroupSchemaType } from "@/src/schemas/groupSchema";



export async function syncEvents(): Promise<EventsPages> {

    const result = await trpcClient.events.list.mutate();

    return result;
};


export async function syncEventsForGroup(group_id: GroupSchemaType["id"]): Promise<EventsPages | null> {

    const result = await trpcClient.events.groupEvents.mutate(group_id);

    return result ?? null;
};