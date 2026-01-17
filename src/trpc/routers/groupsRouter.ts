
import { router, publicProcedure, protectedProcedure } from "@/src/trpc/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { CompiledGroupSchema, NewGroupInputSchemaType, NewGroupInputSchemaValidator } from "@/src/schemas/groupSchema";

export const groupsRouter = router({
    list: publicProcedure
        .mutation(async ({ ctx }) => {
            const results = await ctx.api.groups.getGroups();

            return results;
        }),

    createNewGroup: publicProcedure
        .input(typeboxInput<NewGroupInputSchemaType>(NewGroupInputSchemaValidator))
        .mutation(async ({ ctx, input }) => {
            const user_id = ctx.user?.id;
            console.log("*************** NO USER, RETURNIG EARLY ********************")
            if (!user_id) return null;
            const group = await ctx.api.groups.createGroup(input, user_id);

            return group
        })
})