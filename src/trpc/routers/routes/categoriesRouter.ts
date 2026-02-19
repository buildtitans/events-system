import { router, publicProcedure } from "@/src/trpc/init/init";

export const categoriesRouter = router({
    getAllCategories: publicProcedure
        .mutation(async ({ ctx }) => {

            return await ctx.api.categories.getCategories();

        })
})