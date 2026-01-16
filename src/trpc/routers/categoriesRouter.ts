import { router, publicProcedure } from "../init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { GetAllCategoriesResponseType, GetAllCategoriesResponseValidator } from "@/src/schemas/categoriesSchema";

export const categoriesRouter = router({
    getAllCategories: publicProcedure
        .output(
            typeboxInput<GetAllCategoriesResponseType>(GetAllCategoriesResponseValidator)
        )
        .mutation(async ({ ctx }) => {

            return await ctx.api.categories.getAllCategories()

        })
})