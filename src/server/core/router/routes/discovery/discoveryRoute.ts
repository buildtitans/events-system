import { SearchSchema } from "../../../../schemas/search/searchSchema";
import { publicProcedure, router } from "../../context/init";
import { validateRouterInput } from "../adaptors/validateRouterInput";

const searchRoutes = router({
  events: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.searchEvents(input);
    }),

  groups: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.searchGroups(input);
    }),
});

const suggestRoutes = router({
  events: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.query.suggestEvents(input);
    }),
  groups: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.suggestGroups(input);
    }),

  cities: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.integrations.geoApify.suggestAddresses(
        input,
        "city",
      );
    }),
  addresses: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.integrations.geoApify.suggestAddresses(input);
    }),
});

export const discoveryRoute = router({
  suggest: suggestRoutes,
  search: searchRoutes,
});
