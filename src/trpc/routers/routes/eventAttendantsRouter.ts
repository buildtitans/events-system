import { router, publicProcedure } from "@/src/trpc/init/init";
import { typeboxInput } from "../../adaptors/typeBoxValidation";
import {
    AttendanceUpdateInputSchemaType,
    AttendanceUpdateInputSchemaValidator,
    EventIdSchemaType,
    EventIdSchemaValidator,
    UpdatedAttendanceResponseSchemaType,
    UpdatedAttendanceResponseSchemaValidator
} from "@/src/schemas/events/eventAttendantsSchema";

export const eventAttendantsRouter = router({
    getAttendants:
        publicProcedure
            .input(typeboxInput<EventIdSchemaType>(EventIdSchemaValidator))
            .mutation(async ({ ctx, input }) => {

                return await ctx.api.eventAttendants.getAttendants(input);
            }),

    updateViewerAttendance:
        publicProcedure
            .input(typeboxInput<AttendanceUpdateInputSchemaType>(AttendanceUpdateInputSchemaValidator))
            .output(typeboxInput<UpdatedAttendanceResponseSchemaType>(UpdatedAttendanceResponseSchemaValidator))
            .mutation(async ({ ctx, input }) => {

                const user_id = ctx.user?.id;

                if (!user_id) {
                    console.error("Authenticated session required to use this endpoint");
                    return null;
                }

                const res = await ctx
                    .api
                    .eventAttendants
                    .updateAttendanceStatus(
                        {
                            event_id: input.event_id,
                            user_id: user_id
                        },
                        input.newStatus
                    );
                return res;
            }),

});