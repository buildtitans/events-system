import { router, publicProcedure } from "../init";
import { EventsPages } from "@/src/lib/types/types";
import type { PaginatedLayoutSchemaType } from "@/src/schemas/layoutSlotSchema";
type EventsResponse = {
    items: PaginatedLayoutSchemaType,
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
