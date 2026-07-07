import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/core/context/init";
import {
  EventIDValidator,
  UpdateAttendanceInputValidator,
} from "../inputValidators/inputValidation";

const selectAttendantsRouter = router({
  attendants: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.query.getEventAttendants(
        input,
      );
    }),

  userStatus: protectedProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.participations.rsvps.getUserRsvpToEvent(
        ctx.req.user?.id,
        input,
      );
    }),

  headCount: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.participations.census.getNumberOfAttendantsForEvent(
        input,
      );
    }),

  rsvps: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.rsvps.getRsvpdEvents(
      ctx.req.user?.id,
    );
  }),

  popular: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.services.api.domains.participations.census.getPopularEventsIds();
  }),
});

const writeAttendantsRouter = router({
  rsvp: protectedProcedure
    .input(UpdateAttendanceInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.participations.rsvps.updateRsvpStatus(
        ctx.req.user?.id,
        input.event_id,
        input.newStatus,
      );
    }),
});

export const attendantsRouter = router({
  select: selectAttendantsRouter,
  write: writeAttendantsRouter,
});
