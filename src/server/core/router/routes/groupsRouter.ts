import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/core/context/init";
import {
  searchInputValidator,
  newGroupInputValidator,
  groupIdInputValidator,
  groupSlugInputValidator,
  groupSlugInput,
} from "../inputValidators/inputValidation";

const groupHydrationRouter = router({
  group: publicProcedure.input(groupSlugInput).query(async ({ ctx, input }) => {
    return await ctx.api.services.domains.groups.query.hydrateGroup(input);
  }),
});

const selectGroupEvents = router({
  nextEvent: publicProcedure
    .input(groupIdInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.nextEventForGroup(
        input,
      );
    }),
  history: publicProcedure
    .input(groupIdInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.timeline.getPastEventsForGroup(
        input,
      );
    }),
  list: publicProcedure
    .input(groupIdInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.getGroupEvents(input);
    }),
  archives: protectedProcedure
    .input(groupIdInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.archives(
        ctx.req.user?.id,
        input,
      );
    }),
});

const searchGroups = router({
  categoryName: publicProcedure
    .input(groupIdInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.getCategoryById(input);
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
  groupNames: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.groups.query.getGroupNameDictionary();
  }),
  bySlug: publicProcedure
    .input(groupSlugInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.getGroupFromSlug(
        input,
      );
    }),
});

const readGroupsRouter = router({
  hydrate: groupHydrationRouter,
  events: selectGroupEvents,
  select: searchGroups,
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
  read: readGroupsRouter,
  write: writeGroupsRouter,
});
