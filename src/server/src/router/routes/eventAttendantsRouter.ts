import { router, publicProcedure } from "@/src/server/src/context/init";
import {
  EventIDValidator,
  UpdatedAttendanceResponseValidator,
} from "@/src/schemas/events/eventAttendantsSchema";
import { UpdateAttendanceInputValidator } from "@/src/schemas/events/eventAttendantsSchema";

export const eventAttendantsRouter = router({
  getAttendants: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.service.api.events.getEventAttendants(input);
    }),

  getViewerAttendance: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      const { numGoing, numInterested } =
        await ctx.service.api.participations.census.getNumberOfAttendantsForEvent(
          input,
        );

      const rsvpStatus =
        await ctx.service.api.participations.getUserRsvpToEvent(
          ctx.req.user?.id,
          input,
        );

      const permissions =
        await ctx.service.api.userClient.getRoleBasedLayoutMap(
          ctx.req.user?.id,
        );

      return {
        currentUserStatus: rsvpStatus,
        numGoing: numGoing,
        numInterested: numInterested,
        permissions: permissions,
      };
    }),

  updateViewerAttendance: publicProcedure
    .input(UpdateAttendanceInputValidator)
    .output(UpdatedAttendanceResponseValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.service.api.participations.updateRsvpStatus(
        ctx.req.user?.id,
        input.event_id,
        input.newStatus,
      );
    }),

  getPopularEventIds: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.service.api.participations.census.getPopularEventsIds();
  }),

  getUserRsvpdEvents: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.service.api.participations.getRsvpdEvents(
      ctx.req.user?.id,
    );
  }),
});
