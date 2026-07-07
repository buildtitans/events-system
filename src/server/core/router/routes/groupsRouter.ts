import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/core/context/init";
import { typeboxInputV2 } from "../adaptors/typeBoxValidation";
import { GroupIdArraySchema } from "@/src/schemas/events/eventSchema";
import {
  searchInputValidator,
  newGroupInputValidator,
  groupSlugInputValidator,
} from "../inputValidators/inputValidation";

export const groupsRouter = router({
  list: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.groups.query.getAllGroups();
  }),

  nameLookup: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.groups.query.getGroupNameDictionary();
  }),

  createNewGroup: protectedProcedure
    .input(newGroupInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.groupLifecycle.createNewGroup(
        ctx.req.user?.id,
        input,
      );
    }),

  groupBySlug: publicProcedure
    .input(groupSlugInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.query.getGroupFromSlug(
        input,
      );
    }),

  searchGroups: publicProcedure
    .input(searchInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.query.searchGroups(input);
    }),

  getNextGroupEventLookup: publicProcedure
    .input(typeboxInputV2<GroupIdArraySchema>(GroupIdArraySchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.timeline.getNextEventMap(
        input,
      );
    }),

  popularGroups: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.census.getPopularGroups();
  }),
});

const selectGroupsRouter = router({
  all: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.groups.query.getAllGroups();
  }),

  bySlug: publicProcedure
    .input(groupSlugInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.query.getGroupFromSlug(
        input,
      );
    }),

  popular: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.census.getPopularGroups();
  }),

  search: publicProcedure
    .input(searchInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.query.searchGroups(input);
    }),
});

const lookupRouter = router({
  groupNames: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.groups.query.getGroupNameDictionary();
  }),

  nextEvents: publicProcedure
    .input(typeboxInputV2<GroupIdArraySchema>(GroupIdArraySchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.timeline.getNextEventMap(
        input,
      );
    }),
});

const writeGroupsRouter = router({
  newGroup: protectedProcedure
    .input(newGroupInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.groupLifecycle.createNewGroup(
        ctx.req.user?.id,
        input,
      );
    }),
});

export const groupRouter = router({
  select: selectGroupsRouter,
  write: writeGroupsRouter,
  lookup: lookupRouter,
});
