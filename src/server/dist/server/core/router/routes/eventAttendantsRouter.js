"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventAttendantsRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
const inputValidation_1 = require("../inputValidators/inputValidation");
exports.eventAttendantsRouter = (0, init_1.router)({
    getAttendants: init_1.publicProcedure
        .input(inputValidation_1.EventIDValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.events.getEventAttendants(input);
    }),
    getNumberAttendingEvent: init_1.publicProcedure
        .input(inputValidation_1.EventIDValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.participations.census.getNumberOfAttendantsForEvent(input);
    }),
    getViewerAttendance: init_1.protectedProcedure
        .input(inputValidation_1.EventIDValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.participations.getUserRsvpToEvent(ctx.req.user?.id, input);
    }),
    updateViewerAttendance: init_1.protectedProcedure
        .input(inputValidation_1.UpdateAttendanceInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.participations.updateRsvpStatus(ctx.req.user?.id, input.event_id, input.newStatus);
    }),
    getPopularEventIds: init_1.publicProcedure.mutation(async ({ ctx }) => {
        return ctx.services.api.domains.participations.census.getPopularEventsIds();
    }),
    getUserRsvpdEvents: init_1.protectedProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.participations.getRsvpdEvents(ctx.req.user?.id);
    }),
});
//# sourceMappingURL=eventAttendantsRouter.js.map