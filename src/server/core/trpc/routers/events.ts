import { router, publicProcedure } from "../trpc";
import { cardData } from "@/src/lib/tokens/cardTokens";
import { eventsRepo } from "../repos/events.repo";
import { randomUUID } from "crypto";
import { AuthorsSchema } from "@/src/schemas/zod/eventZodSchema";


const eventsRouter = router({
    list: publicProcedure.query(async ({ ctx }) => {
        const rows = await eventsRepo(ctx.db).list()
        const events = rows.map((card) => {
            const parsed = AuthorsSchema.safeParse(card.authors) ?? [];
            return {
                id: card.id,
                title: card.title,
                description: card.description,
                tag: card.tag,
                img: card.img ?? null,
                authors: parsed.success ? parsed.data : [],
                created_at: card.created_at ?? null,
                updated_at: card.updated_at ?? null
            }
        }
        );

        return {
            items: events,
            meta: {
                total: events.length
            }
        }
    }),
    seed: publicProcedure
        .mutation(async ({ ctx }) => {
            const rows = cardData.map((card) => ({
                id: randomUUID(),
                title: card.title,
                description: card.description,
                tag: card.tag,
                img: card.img ?? null,
                authors: card.authors ?? [],
            }));
            const items = await eventsRepo(ctx.db).insertMany(rows)

            return {
                inserted: items.length,
            }
        })
});

export { eventsRouter };