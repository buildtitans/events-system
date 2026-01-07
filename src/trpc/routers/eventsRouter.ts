import { Events } from "@/src/server/db/types";
import { router, publicProcedure } from "../init";

type EventsResponse = {
    items: Events[],
    meta: {
        total: number
    }
}

export const eventsRouter = router({
    list: publicProcedure.mutation(async ({ ctx }): Promise<EventsResponse> => {
        const rows = await ctx.api.getEvents();

        return {
            items: rows,
            meta: { total: Array.isArray(rows) ? rows.length : 0 },
        };
    }),
});
