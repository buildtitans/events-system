
import { router, publicProcedure } from "@/src/trpc/init/init";
import { typeboxInput } from "../../adaptors/typeBoxValidation";
import { GroupSlugSchemaType, GroupSlugSchemaValidator, NewGroupInputSchemaType, NewGroupInputSchemaValidator } from "@/src/schemas/groups/groupSchema";

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

            if (!user_id) return null;

            const group = await ctx.api.groups.createGroup(input, user_id);

            if (group && group.organizer_id) {
                const { id, organizer_id } = group;

                await ctx.api.groupMembers.addOrganizer({ user_id: organizer_id, group_id: id });

            }


            return group
        }),

    groupBySlug: publicProcedure
        .input(typeboxInput<GroupSlugSchemaType>(GroupSlugSchemaValidator))
        .mutation(async ({ ctx, input }) => {

            return await ctx.api.groups.getGroupBySlug(input);
        })
})