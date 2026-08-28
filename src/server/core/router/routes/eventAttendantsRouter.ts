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
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.getEventAttendants(
        input,
      );
    }),

  userStatus: protectedProcedure
    .input(EventIDValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.participations.rsvps.getUserRsvpToEvent(
        ctx.req.user?.id,
        input,
      );
    }),

  headCount: publicProcedure
    .input(EventIDValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.participations.census.getNumberOfAttendantsForEvent(
        input,
      );
    }),

  rsvps: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.participations.rsvps.getRsvpdEvents(
      ctx.req.user?.id,
    );
  }),
});

const writeAttendantsRouter = router({
  rsvp: protectedProcedure
    .input(UpdateAttendanceInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.participations.rsvps.updateRsvpStatus(
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
