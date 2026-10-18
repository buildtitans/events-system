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
import { NewEventInputValidator } from "../inputValidators/inputValidation";
import {
  EventIDValidator,
  searchInputValidator,
} from "../inputValidators/inputValidation";

const selectEventsRouter = router({
  search: publicProcedure
    .input(searchInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.searchEvents(input);
    }),
  suggest: publicProcedure
    .input(searchInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.suggestEvents(input);
    }),
  hydrateEvent: publicProcedure
    .input(EventIDValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.hydrate.event(
        ctx.req.user?.id,
        input,
      );
    }),
});

const writeEventsRouter = router({
  create: protectedProcedure
    .input(NewEventInputValidator)
    .mutation(async ({ ctx, input }) => {
      return ctx.api.services.domains.events.lifecycle.createEvent(
        input,
        ctx.req.user?.id,
      );
    }),

  update: protectedProcedure
    .input(
      typeboxInput<UpdateEventArgsSchemaType>(UpdateEventArgsSchemaValidator),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.lifecycle.updateEventStatus(
        ctx.req.user?.id,
        input,
      );
    }),
});

export const eventRouter = router({
  select: selectEventsRouter,
  write: writeEventsRouter,
});
