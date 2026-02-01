import { router, publicProcedure } from "@/src/trpc/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { EventIdSchemaType, EventIdSchemaValidator } from "@/src/schemas/eventAttendantsSchema";

export const eventAttendantsRouter = router({
    getAttendants:
        publicProcedure
            .input(typeboxInput<EventIdSchemaType>(EventIdSchemaValidator))
            .mutation(async ({ ctx, input }) => {

                return await ctx.api.eventAttendants.getAttendants(input);
            })
});