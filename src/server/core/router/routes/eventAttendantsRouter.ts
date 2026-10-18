import { router, protectedProcedure } from "@/src/server/core/context/init";
import { UpdateAttendanceInputValidator } from "../inputValidators/inputValidation";

const selectAttendantsRouter = router({
  rsvps: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.participations.attendance.rsvps(
      ctx.req.user?.id,
    );
  }),
});

const writeAttendantsRouter = router({
  rsvp: protectedProcedure
    .input(UpdateAttendanceInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.participations.attendance.updateRsvpStatus(
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
