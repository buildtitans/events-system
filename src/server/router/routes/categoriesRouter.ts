import { router, publicProcedure } from "@/src/server/bootstrap/init";

export const categoriesRouter = router({
    getAllCategories: publicProcedure
        .mutation(async ({ ctx }) => {

            return await ctx.api.categories.getCategories();

        })
})