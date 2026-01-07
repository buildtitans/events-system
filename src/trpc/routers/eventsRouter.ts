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
        const rows = await ctx.eventsClient.getEvents();
        return rows;
    }),
});
