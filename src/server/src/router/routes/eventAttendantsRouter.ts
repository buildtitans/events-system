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
      return await ctx.services.api.domains.events.getEventAttendants(input);
    }),

  getViewerAttendance: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      const { numGoing, numInterested } =
        await ctx.services.api.domains.participations.census.getNumberOfAttendantsForEvent(
          input,
        );

      console.log({
        going: numGoing,
        interested: numInterested,
      });

      const rsvpStatus =
        await ctx.services.api.domains.participations.getUserRsvpToEvent(
          ctx.req.user?.id,
          input,
        );

      console.log(rsvpStatus);

      const permissions =
        await ctx.services.api.domains.users.getRoleBasedLayoutMap(
          ctx.req.user?.id,
        );

      console.log(permissions);

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
      return await ctx.services.api.domains.participations.updateRsvpStatus(
        ctx.req.user?.id,
        input.event_id,
        input.newStatus,
      );
    }),

  getPopularEventIds: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.services.api.domains.participations.census.getPopularEventsIds();
  }),

  getUserRsvpdEvents: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.getRsvpdEvents(
      ctx.req.user?.id,
    );
  }),
});
