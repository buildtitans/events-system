import { SearchSchema } from "@/src/schemas/search/searchSchema";
import { publicProcedure, router } from "@/src/server/core/context/init";
import { validateRouterInput } from "@/src/server/core/router/adaptors/validateRouterInput";

const locationsRoute = router({
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

const appDiscoveryRoute = router({
  search: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.query.search(input);
    }),

  suggestions: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.query.suggestions(input);
    }),
});

export const discoveryRoute = router({
  locations: locationsRoute,
  app: appDiscoveryRoute,
});
