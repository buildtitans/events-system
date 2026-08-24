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
  groupsByCategoryInputValidator,
  groupIdInputValidator,
} from "../inputValidators/inputValidation";

const selectGroupsRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.groups.query.getAllGroups();
  }),

  bySlug: publicProcedure
    .input(groupSlugInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.getGroupFromSlug(
        input,
      );
    }),

  categoryById: publicProcedure
    .input(groupIdInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.getCategoryById(input);
    }),

  byCategory: publicProcedure
    .input(groupsByCategoryInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.byCategory(input);
    }),

  popular: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.participations.census.getPopularGroups();
  }),

  search: publicProcedure
    .input(searchInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.searchGroups(input);
    }),

  suggest: publicProcedure
    .input(searchInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.suggestGroups(input);
    }),
});

const lookupRouter = router({
  groupNames: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.groups.query.getGroupNameDictionary();
  }),

  nextEvents: publicProcedure
    .input(typeboxInputV2<GroupIdArraySchema>(GroupIdArraySchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.timeline.getNextEventMap(
        input,
      );
    }),
});

const writeGroupsRouter = router({
  newGroup: protectedProcedure
    .input(newGroupInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.groupLifecycle.createNewGroup(
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
