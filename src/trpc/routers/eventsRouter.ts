import { Events } from "@/src/server/db/types";
import { router, publicProcedure } from "../init";
import { EventsArraySchemaType } from "@/src/schemas/eventSchema";

type EventsResponse = {
    items: EventsArraySchemaType,
    meta: {
        total: number
    }
}

export const eventsRouter = router({
    list: publicProcedure.mutation(async ({ ctx }): Promise<EventsResponse> => {
        const rows = await ctx.api.getEvents();

        return {
            items: rows.items,
            meta: rows.items.length
        };
    }),
});
