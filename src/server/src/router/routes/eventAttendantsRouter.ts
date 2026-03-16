import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/src/context/init";
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

  getNumberAttendingEvent: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.participations.census.getNumberOfAttendantsForEvent(
        input,
      );
    }),

  getViewerAttendance: protectedProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.participations.getUserRsvpToEvent(
        ctx.req.user?.id,
        input,
      );
    }),

  updateViewerAttendance: protectedProcedure
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

  getUserRsvpdEvents: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.getRsvpdEvents(
      ctx.req.user?.id,
    );
  }),
});
