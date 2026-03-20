import {
  UpdateEventArgsSchemaType,
  UpdateEventArgsSchemaValidator,
} from "@/src/schemas/events/eventSchema";
import { SearchInputSchemaValidator } from "@/src/schemas/search/searchSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/src/context/init";
import { NewEventInputValidator } from "@/src/schemas/events/eventSchema";
import { groupIdInputValidator } from "./groupMembersRouter";
import {
  EventIdInputValidator,
  EventIDValidator,
} from "@/src/schemas/events/eventAttendantsSchema";

export const eventsRouter = router({
  list: publicProcedure.mutation(async ({ ctx }) => {
    const events = await ctx.services.api.domains.events.getAllEvents();

    return ctx.services.layout.compileLayout(events);
  }),

  newEvent: protectedProcedure
    .input(NewEventInputValidator)
    .mutation(async ({ ctx, input }) => {
      return ctx.services.api.domains.events.createEvent(
        input,
        input.group_id,
        ctx.req.user?.id,
      );
    }),

  groupEventsLayout: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      const events =
        await ctx.services.api.domains.events.getGroupEvents(input);

      return ctx.services.layout.compileLayout(events);
    }),

  getGroupEvents: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      const events =
        await ctx.services.api.domains.events.getGroupEvents(input);
      return ctx.services.layout.compileLayout(events);
    }),

  getGroupHistory: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.getGroupEvents(input);
    }),

  updateEventStatus: protectedProcedure
    .input(
      typeboxInput<UpdateEventArgsSchemaType>(UpdateEventArgsSchemaValidator),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.updateEventStatus(
        ctx.req.user?.id,
        input,
      );
    }),

  eventsById: publicProcedure
    .input(EventIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      const events =
        await ctx.services.api.domains.events.selectEventsById(input);
      return ctx.services.layout.compileLayout(events);
    }),

  getFlattendEvents: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.events.getAllEvents();
  }),

  getEvent: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.getEventById(input);
    }),

  eventForDrawer: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.hydrate.openedEvent(
        ctx.req.user?.id,
        input,
      );
    }),

  search: publicProcedure
    .input(SearchInputSchemaValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.searchEvents(input);
    }),
});
