import {
  GroupIdSchemaType,
  GroupIdSchemaValidator,
  UpdateEventArgsSchemaType,
  UpdateEventArgsSchemaValidator,
} from "@/src/schemas/events/eventSchema";
import { SearchInputSchemaValidator } from "@/src/schemas/search/searchSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { router, publicProcedure } from "@/src/server/src/bootstrap/init";
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";
import { NewEventInputValidator } from "@/src/schemas/events/eventSchema";
import { groupIdInputValidator } from "./groupMembersRouter";
import {
  EventIdInputValidator,
  EventIDValidator,
} from "@/src/schemas/events/eventAttendantsSchema";

export const eventsRouter = router({
  list: publicProcedure.mutation(async ({ ctx }) => {
    const rows = await ctx.api.events.getEvents();

    return ctx.services.formatLayout.compileLayout(rows);
  }),

  newEvent: publicProcedure
    .input(NewEventInputValidator)
    .mutation(async ({ ctx, input }) => {
      const permitted = ctx.auth.can(
        "create event",
        input.group_id,
        ctx.cache.roleLookupMap,
      );

      if (!permitted) {
        throw new TRPCResolverError(
          403,
          "Permission denied to create a new event",
        );
      }

      return await ctx.api.events.createNewEvent(input);
    }),

  groupEvents: publicProcedure
    .input(groupIdInputValidator)
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
      const permitted = ctx.auth.can(
        "update event",
        input.group_id,
        ctx.cache.roleLookupMap,
      );
      if (!permitted) {
        throw new TRPCResolverError(
          403,
          "Permission denied to RSVP for this event",
        );
      }

      return ctx.api.events.updateEventStatus(input);
    }),

  eventsById: publicProcedure
    .input(EventIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.events.getEventsByIds(input);
    }),

  getFlattendEvents: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.api.events.getFlattenedEvents();
  }),

  getEvent: publicProcedure
    .input(EventIDValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.events.getEvent(input);
    }),

  search: publicProcedure
    .input(SearchInputSchemaValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.events.searchEventByTitle(input);
    }),
});
