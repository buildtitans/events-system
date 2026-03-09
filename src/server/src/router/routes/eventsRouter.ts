import {
  GroupIdSchemaType,
  GroupIdSchemaValidator,
  NewEventInputSchemaType,
  NewEventInputSchemaValidator,
  UpdateEventArgsSchemaType,
  UpdateEventArgsSchemaValidator,
} from "@/src/schemas/events/eventSchema";
import {
  EventSearchSchemaType,
  CompiledEventSearchSchema,
} from "@/src/schemas/events/eventsSearchSchema";
import {
  CompiledEventIdsSchema,
  EventIdsSchemaType,
} from "@/src/schemas/events/eventAttendantsSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { router, publicProcedure } from "@/src/server/src/bootstrap/init";
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";

export const eventsRouter = router({
  list: publicProcedure.mutation(async ({ ctx }) => {
    const rows = await ctx.api.events.getEvents();

    return rows;
  }),

  newEvent: publicProcedure
    .input(typeboxInput<NewEventInputSchemaType>(NewEventInputSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      const permitted = ctx.auth.can("create event", input.group_id);

      if (!permitted) {
        throw new TRPCResolverError(
          403,
          "Permission denied to create a new event",
        );
      }

      return await ctx.api.events.createNewEvent(input);
    }),

  groupEvents: publicProcedure
    .input(typeboxInput<GroupIdSchemaType>(GroupIdSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      if (!input) return null;
      return await ctx.api.events.getGroupEvents(input);
    }),

  groupHistory: publicProcedure
    .input(typeboxInput<GroupIdSchemaType>(GroupIdSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.events.getGroupEventsByGroupId(input);
    }),

  updateEventStatus: publicProcedure
    .input(
      typeboxInput<UpdateEventArgsSchemaType>(UpdateEventArgsSchemaValidator),
    )
    .mutation(({ ctx, input }) => {
      const permitted = ctx.auth.can("update event", input.group_id);
      if (!permitted) {
        throw new TRPCResolverError(
          403,
          "Permission denied to RSVP for this event",
        );
      }

      return ctx.api.events.updateEventStatus(input);
    }),

  eventsById: publicProcedure
    .input(typeboxInput<EventIdsSchemaType>(CompiledEventIdsSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.events.getEventsByIds(input);
    }),

  getFlattendEvents: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.api.events.getFlattenedEvents();
  }),

  search: publicProcedure
    .input(typeboxInput<EventSearchSchemaType>(CompiledEventSearchSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.events.searchEventByTitle(input);
    }),
});
