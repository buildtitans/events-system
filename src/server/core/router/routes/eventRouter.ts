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

const selectEventsRouter = router({
  search: publicProcedure
    .input(searchInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.query.searchEvents(input);
    }),

  byId: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.query.getEventById(input);
    }),

  archives: protectedProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.timeline.getArchivedGroupEvents(
        ctx.req.user?.id,
        input,
      );
    }),

  history: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.timeline.getPastEventsForGroup(
        input,
      );
    }),

  forGroup: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.query.getGroupEvents(input);
    }),

  hydrateEvent: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.hydrate.openedEvent(
        ctx.req.user?.id,
        input,
      );
    }),
});

const layoutRouter = router({
  all: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.events.layout.all();
  }),

  allActive: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.events.layout.active();
  }),

  byIds: publicProcedure
    .input(EventIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.layout.byIds(input);
    }),

  forGroup: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.layout.forGroup(input);
    }),
});

const writeEventsRouter = router({
  create: protectedProcedure
    .input(NewEventInputValidator)
    .mutation(async ({ ctx, input }) => {
      return ctx.services.api.domains.events.lifecycle.createEvent(
        input,
        input.group_id,
        ctx.req.user?.id,
      );
    }),

  update: protectedProcedure
    .input(
      typeboxInput<UpdateEventArgsSchemaType>(UpdateEventArgsSchemaValidator),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.lifecycle.updateEventStatus(
        ctx.req.user?.id,
        input,
      );
    }),
});

export const eventRouter = router({
  select: selectEventsRouter,
  write: writeEventsRouter,
  layout: layoutRouter,
});
