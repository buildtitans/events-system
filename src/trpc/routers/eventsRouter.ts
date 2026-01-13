import { router, publicProcedure } from "../init";

export const eventsRouter = router({
    list: publicProcedure.
        mutation(async ({ ctx }) => {

            const rows = await ctx.api.events.getEvents()
            return rows
        }),

});
