"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRouter = void 0;
const eventSchema_1 = require("@/src/schemas/events/eventSchema");
const searchSchema_1 = require("@/src/schemas/search/searchSchema");
const typeBoxValidation_1 = require("../adaptors/typeBoxValidation");
const init_1 = require("@/src/server/core/context/init");
const eventSchema_2 = require("@/src/schemas/events/eventSchema");
const groupMembersRouter_1 = require("./groupMembersRouter");
const eventAttendantsSchema_1 = require("@/src/schemas/events/eventAttendantsSchema");
exports.eventsRouter = (0, init_1.router)({
    list: init_1.publicProcedure.mutation(async ({ ctx }) => {
        const events = await ctx.services.api.domains.events.getAllEvents();
        return ctx.services.layout.compileLayout(events);
    }),
    newEvent: init_1.protectedProcedure
        .input(eventSchema_2.NewEventInputValidator)
        .mutation(async ({ ctx, input }) => {
        return ctx.services.api.domains.events.createEvent(input, input.group_id, ctx.req.user?.id);
    }),
    groupEventsLayout: init_1.publicProcedure
        .input(groupMembersRouter_1.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        const events = await ctx.services.api.domains.events.getGroupEvents(input);
        return ctx.services.layout.compileLayout(events);
    }),
    getGroupEvents: init_1.publicProcedure
        .input(groupMembersRouter_1.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        const events = await ctx.services.api.domains.events.getGroupEvents(input);
        return ctx.services.layout.compileLayout(events);
    }),
    getFlattenedGroupEvents: init_1.publicProcedure
        .input(groupMembersRouter_1.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.events.getGroupEvents(input);
    }),
    getGroupHistory: init_1.publicProcedure
        .input(groupMembersRouter_1.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.events.getPastEvents(input);
    }),
    updateEventStatus: init_1.protectedProcedure
        .input((0, typeBoxValidation_1.typeboxInput)(eventSchema_1.UpdateEventArgsSchemaValidator))
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.events.updateEventStatus(ctx.req.user?.id, input);
    }),
    eventsById: init_1.publicProcedure
        .input(eventAttendantsSchema_1.EventIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        const events = await ctx.services.api.domains.events.selectEventsById(input);
        return ctx.services.layout.compileLayout(events);
    }),
    getFlattendEvents: init_1.publicProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.events.getAllEvents();
    }),
    getEvent: init_1.publicProcedure
        .input(eventAttendantsSchema_1.EventIDValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.events.getEventById(input);
    }),
    eventForDrawer: init_1.publicProcedure
        .input(eventAttendantsSchema_1.EventIDValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.events.hydrate.openedEvent(ctx.req.user?.id, input);
    }),
    search: init_1.publicProcedure
        .input(searchSchema_1.SearchInputSchemaValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.events.searchEvents(input);
    }),
});
//# sourceMappingURL=eventsRouter.js.map