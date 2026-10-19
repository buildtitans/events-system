import { validateRouterInput } from "../adaptors/validateRouterInput";
import { SearchSchema } from "@/src/schemas/search/searchSchema";
import { router, publicProcedure } from "@/src/server/core/context/init";

export const geoCodingRouter = router({
  addressSuggestions: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.integrations.geoApify.suggestAddresses(input);
    }),

  citySearchSuggestions: publicProcedure
    .input(validateRouterInput(SearchSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.integrations.geoApify.suggestAddresses(
        input,
        "city",
      );
    }),
});
