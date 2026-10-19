import { validateRouterInput } from "@/src/server/core/router/adaptors/validateRouterInput";
import { router, publicProcedure } from "@/src/server/core/context/init";
import { GroupSlugSchema } from "@/src/schemas/groups/groupSchema";
import { SearchSchema } from "@/src/schemas/search/searchSchema";

const listGroupsRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.groups.hydrate.list.discovery();
  }),
  popular: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.groups.hydrate.list.popular();
  }),
  fromCategory: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.hydrate.list.byCategory(
        input,
      );
    }),
});

export const hydrateGroupsRouter = router({
  single: publicProcedure
    .input(validateRouterInput(GroupSlugSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.hydrate.single(input);
    }),

  list: listGroupsRouter,
});
