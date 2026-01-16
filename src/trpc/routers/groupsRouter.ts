
import { router, publicProcedure, protectedProcedure } from "@/src/trpc/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { CompiledGroupSchema, NewGroupInputSchemaType } from "@/src/schemas/groupSchema";

export const groupsRouter = router({
    list: publicProcedure
        .mutation(async ({ ctx }) => {
            const results = await ctx.api.groups.getGroups();

            return results;
        }),

    createNewGroup: publicProcedure
        .input(typeboxInput<NewGroupInputSchemaType>(CompiledGroupSchema))
        .mutation(async ({ ctx, input }) => {
            return ctx.api.groups.createGroup(input)
        })
})