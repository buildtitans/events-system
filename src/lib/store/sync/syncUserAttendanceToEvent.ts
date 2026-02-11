import { trpcClient } from "@/src/trpc/trpcClient";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";

export async function syncUserAttendanceToEvent(event: EventSchemaType) {
    const res = await trpcClient
        .auth
        .session
        .mutate();

    const user_id = res?.user_id;

    const attendantsReq = await trpcClient
        .eventAttendants
        .getAttendants
        .mutate(event.id);

    return {
        attendantsReq,
        user_id
    }
}