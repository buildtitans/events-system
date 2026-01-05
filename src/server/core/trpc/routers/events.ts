import { router, publicProcedure } from "../trpc";
import { cardData } from "@/src/lib/tokens/cardTokens";
import { EventPaginationSchema } from "@/src/schemas/zod/eventPaginationInputSchema";


const eventsRouter = router({
    list:
        publicProcedure
            .input(EventPaginationSchema)
            .query(({ input }) => {
                const events = [...cardData] // <-- replace with db query after establishing Docker + PostgresSQL DB
                const { page, limit } = input as any;

                return {
                    items: events,
                    meta: {
                        page: page,
                        limit: limit,
                        total: events.length
                    }
                }
            })
});

export { eventsRouter };