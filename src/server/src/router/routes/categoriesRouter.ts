import { router, publicProcedure } from "@/src/server/src/context/init";

export const categoriesRouter = router({
  getAllCategories: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.services.api.domains.groups.getGroupCategories();
  }),
});
