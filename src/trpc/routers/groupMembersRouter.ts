
import { router, publicProcedure } from "@/src/trpc/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { GroupIDForInsertSchemaType, GroupIDForInsertSchemaValidator } from "@/src/schemas/groupMembersSchema";
import type { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";

const groupMembersRouter = router({
    addNewMember:
        publicProcedure
            .input(typeboxInput<GroupIDForInsertSchemaType>(GroupIDForInsertSchemaValidator))
            .mutation(async ({ ctx, input }) => {
                const token = ctx.req.cookies.session;
                if (!token) return null;
                const sess = await ctx.api.auth.getSession(token);
                if (!sess?.user_id) return null;

                const newMember: Pick<GroupMembersSchemaType, "group_id" | "user_id"> = {
                    group_id: input,
                    user_id: sess.user_id
                };

                return await ctx.api.groupMembers.addNewMember(newMember);


            }),

    getGroupMembers:
        publicProcedure
            .input(typeboxInput<GroupIDForInsertSchemaType>(GroupIDForInsertSchemaValidator))
            .mutation(async ({ ctx, input }) => {

                return await ctx.api.groupMembers.getGroupMembers(input)
            }),

    viewerMemberships:
        publicProcedure

            .mutation(async ({ ctx }) => {

                const user_id = ctx.user?.id;

                if (!user_id) return null;

                return ctx.api.groupMembers.getViewerMemberships(user_id);

            })
})

export { groupMembersRouter };