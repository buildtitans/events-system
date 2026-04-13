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
    return await ctx.services.api.domains.groups.getAllGroups();
  }),

  nameLookup: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.groups.getGroupNameDictionary();
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
      return await ctx.services.api.domains.groups.getGroupFromSlug(input);
    }),

  searchGroups: publicProcedure
    .input(searchInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.searchGroups(input);
    }),

  getNextGroupEventLookup: publicProcedure
    .input(typeboxInputV2<GroupIdArraySchema>(GroupIdArraySchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.getNextEventLookupMap(input);
    }),

  popularGroups: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.getMostPopularGroups();
  }),
});
