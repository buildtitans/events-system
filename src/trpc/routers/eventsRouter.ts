import {
    GroupIdSchemaType,
    GroupIdSchemaValidator,
    NewEventInputSchemaType,
    NewEventInputSchemaValidator,
    UpdateEventArgsSchemaType,
    UpdateEventArgsSchemaValidator
} from "@/src/schemas/events/eventSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { router, publicProcedure } from "../init";


export const eventsRouter = router({
    list: publicProcedure.
        mutation(async ({ ctx }) => {

            const rows = await ctx
                .api
                .events
                .getEvents();

            return rows;
        }),

    newEvent: publicProcedure
        .input(typeboxInput<NewEventInputSchemaType>(NewEventInputSchemaValidator))
        .mutation(async ({ ctx, input }) => {

            const user_id = ctx.user?.id;
            if (!user_id) return null;

            return await ctx
                .api
                .events
                .createNewEvent(input);
        }),

    groupEvents: publicProcedure
        .input(typeboxInput<GroupIdSchemaType>(GroupIdSchemaValidator))
        .mutation(async ({ ctx, input }) => {

            if (!input) return null;
            return await ctx
                .api
                .events
                .getGroupEvents(input);
        }),

    updateEventStatus:
        publicProcedure
            .input(typeboxInput<UpdateEventArgsSchemaType>(UpdateEventArgsSchemaValidator))
            .mutation(({ ctx, input }) => {

                if (ctx.user?.id !== input.organizer_id) return null;

                return ctx
                    .api
                    .events
                    .updateEventStatus(input);
            })
});