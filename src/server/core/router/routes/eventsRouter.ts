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
    return await ctx.services.api.domains.events.layout.all();
  }),

  allActiveEventsLayout: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.events.layout.active();
  }),

  groupEventsLayout: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.layout.forGroup(input);
    }),

  getFlattenedGroupEvents: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.query.getGroupEvents(input);
    }),

  getGroupHistory: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.timeline.getPastEventsForGroup(
        input,
      );
    }),

  eventsById: publicProcedure
    .input(EventIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.layout.byIds(input);
    }),

  getEvent: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.query.getEventById(input);
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
      return await ctx.services.api.domains.events.query.searchEvents(input);
    }),

  getArchivedGroupEvents: protectedProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.timeline.getArchivedGroupEvents(
        ctx.req.user?.id,
        input,
      );
    }),

  updateEventStatus: protectedProcedure
    .input(
      typeboxInput<UpdateEventArgsSchemaType>(UpdateEventArgsSchemaValidator),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.lifecycle.updateEventStatus(
        ctx.req.user?.id,
        input,
      );
    }),

  newEvent: protectedProcedure
    .input(NewEventInputValidator)
    .mutation(async ({ ctx, input }) => {
      return ctx.services.api.domains.events.lifecycle.createEvent(
        input,
        input.group_id,
        ctx.req.user?.id,
      );
    }),
});
