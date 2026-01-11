import { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
import { router, publicProcedure } from "../init";

type EventsResponse = {
    items: LayoutSlotSchemaType[],
    meta: {
        total: number
    }
}


export const eventsRouter = router({
    list: publicProcedure.
        mutation(async ({ ctx }): Promise<EventsResponse> => {

            const rows = await ctx.api.getEvents();
            return rows
        }),

});
