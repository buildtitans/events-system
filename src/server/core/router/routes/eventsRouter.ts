import {
  UpdateEventArgsSchemaType,
  UpdateEventArgsSchemaValidator,
} from "@/src/schemas/events/eventSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/core/context/init";
import {
  NewEventInputValidator,
  groupIdInputValidator,
} from "../inputValidators/inputValidation";
import {
  EventIdInputValidator,
  EventIDValidator,
  searchInputValidator,
} from "../inputValidators/inputValidation";

export const eventsRouter = router({
  allEventsLayout: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.events.getAllEventsLayout();
  }),

  allActiveEventsLayout: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.events.getAllActiveEventsLayout();
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
      return await ctx.services.api.domains.events.getGroupEventsLayout(input);
    }),

  getFlattenedGroupEvents: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.getGroupEvents(input);
    }),

  getGroupHistory: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.getPastEvents(input);
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
      return await ctx.services.api.domains.events.selectEventsById(input);
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
    .input(searchInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.searchEvents(input);
    }),
});
