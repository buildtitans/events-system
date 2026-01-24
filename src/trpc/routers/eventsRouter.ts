import { NewEventInputSchema, NewEventInputSchemaType, NewEventInputSchemaValidator } from "@/src/schemas/eventSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { router, publicProcedure } from "../init";

export const eventsRouter = router({
    list: publicProcedure.
        mutation(async ({ ctx }) => {

            const rows = await ctx.api.events.getEvents()
            return rows
        }),

    newEvent: publicProcedure
        .input(typeboxInput<NewEventInputSchemaType>(NewEventInputSchemaValidator))
        .mutation(async ({ ctx, input }) => {

            const user_id = ctx.user?.id;
            if (!user_id) return null;
            return await ctx.api.events.createNewEvent(input)
        })

});
