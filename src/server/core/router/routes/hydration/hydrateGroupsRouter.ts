import { validateRouterInput } from "@/src/server/core/router/adaptors/validateRouterInput";
import { router, publicProcedure } from "@/src/server/core/context/init";
import { GroupSlugSchema } from "@/src/schemas/groups/groupSchema";
import { SearchSchema } from "@/src/schemas/search/searchSchema";

const listGroupsRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.groups.query.discovery();
  }),
  popular: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.groups.query.popular();
  }),
  fromCategory: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.byCategory(input);
    }),
});

export const hydrateGroupsRouter = router({
  single: publicProcedure
    .input(validateRouterInput(GroupSlugSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.hydrateGroup(input);
    }),

  list: listGroupsRouter,
});
