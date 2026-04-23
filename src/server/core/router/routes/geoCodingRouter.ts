import { router, publicProcedure } from "@/src/server/core/context/init";
import { GeoApifySearchInput } from "../inputValidators/inputValidation";

export const geoCodingRouter = router({
  addressSuggestions: publicProcedure
    .input(GeoApifySearchInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.integrations.geoApify.suggestAddresses(input);
    }),
});
