import { router, publicProcedure } from "@/src/server/src/bootstrap/init";

import {
  AttendanceUpdateInputSchemaType,
  AttendanceUpdateInputSchemaValidator,
  EventIdSchemaType,
  EventIdSchemaValidator,
  UpdatedAttendanceResponseSchemaType,
  UpdatedAttendanceResponseSchemaValidator,
} from "@/src/schemas/events/eventAttendantsSchema";
import { curatePopularEventsIds } from "../../lib/utils/curatePopularEventsIds";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";

export const eventAttendantsRouter = router({
  getAttendants: publicProcedure
    .input(typeboxInput<EventIdSchemaType>(EventIdSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.eventAttendants.getAttendants(input);
    }),

  getViewerAttendance: publicProcedure
    .input(typeboxInput<EventIdSchemaType>(EventIdSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      const attendance = ctx.cache.attendanceDictionary;

      const userRecord = attendance[`${input}`];

      const { numGoing, numInterested } =
        await ctx.serviceclient.getNumberOfAttendantsForEvent(input);

      return {
        currentUserStatus: userRecord,
        numGoing: numGoing,
        numInterested: numInterested,
        permissions: ctx.cache.roleLookupMap,
      };
    }),
  updateViewerAttendance: publicProcedure
    .input(
      typeboxInput<AttendanceUpdateInputSchemaType>(
        AttendanceUpdateInputSchemaValidator,
      ),
    )
    .output(
      typeboxInput<UpdatedAttendanceResponseSchemaType>(
        UpdatedAttendanceResponseSchemaValidator,
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.user?.id;

      if (!user_id) {
        console.error("Authenticated session required to use this endpoint");
        return null;
      }

      return await ctx.api.eventAttendants.updateAttendanceStatus(
        { event_id: input.event_id, user_id: user_id },
        input.newStatus,
      );
    }),

  getPopularEventIds: publicProcedure.mutation(async ({ ctx }) => {
    const records = await ctx.api.eventAttendants.getAllAttendanceRecords();
    return curatePopularEventsIds(records);
  }),

  getUserRsvpdEvents: publicProcedure.mutation(async ({ ctx }) => {
    const user_id = ctx.user?.id;

    if (!user_id) {
      throw new TRPCResolverError(403, "Permission to access user data denied");
    }

    return await ctx.serviceclient.getRsvpdEvents(user_id);
  }),
});

export type EventAttendantsRouter = typeof eventAttendantsRouter;
