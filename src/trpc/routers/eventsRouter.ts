import { router, publicProcedure } from "../init";

export const eventsRouter = router({
    list: publicProcedure.query(async ({ ctx }) => {
        const rows = await ctx.api.getEvents();

        return {
            items: rows,
            meta: { total: Array.isArray(rows) ? rows.length : 0 },
        };
    }),
});
