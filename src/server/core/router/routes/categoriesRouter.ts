import { router, publicProcedure } from "@/src/server/core/context/init";

export const categoriesRouter = router({
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.services.api.domains.groups.query.getGroupCategories();
  }),
});
