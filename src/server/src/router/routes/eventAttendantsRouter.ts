import { router, publicProcedure } from "@/src/server/src/bootstrap/init";
import {
  EventIDValidator,
  UpdatedAttendanceResponseValidator,
} from "@/src/schemas/events/eventAttendantsSchema";
import { curatePopularEventsIds } from "../../lib/utils/curatePopularEventsIds";
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";
import { UpdateAttendanceInputValidator } from "@/src/schemas/events/eventAttendantsSchema";

export const eventAttendantsRouter = router({
  getAttendants: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.eventAttendants.getAttendants(input);
    }),

  getViewerAttendance: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      const attendance = ctx.cache.attendanceDictionary;

      const userRecord = attendance[`${input}`];

      const { numGoing, numInterested } =
        await ctx.services.attendanceClient.getNumberOfAttendantsForEvent(
          input,
        );

      return {
        currentUserStatus: userRecord,
        numGoing: numGoing,
        numInterested: numInterested,
        permissions: ctx.cache.roleLookupMap,
      };
    }),

  updateViewerAttendance: publicProcedure
    .input(UpdateAttendanceInputValidator)
    .output(UpdatedAttendanceResponseValidator)
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

    return await ctx.services.participationsClient.getRsvpdEvents(user_id);
  }),
});
