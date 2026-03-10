import { router, publicProcedure } from "@/src/server/src/bootstrap/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import {
  CompiledMemberToRemoveSchema,
  GroupIDForInsertSchemaType,
  GroupIDForInsertSchemaValidator,
  MemberToRemoveSchemaType,
} from "@/src/schemas/groups/groupMembersSchema";
import type { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";

const groupMembersRouter = router({
  addNewMember: publicProcedure
    .input(
      typeboxInput<GroupIDForInsertSchemaType>(GroupIDForInsertSchemaValidator),
    )
    .mutation(async ({ ctx, input }) => {
      const token = ctx.req.cookies.session;
      if (!token) return null;
      const sess = await ctx.api.auth.getSession(token);
      if (!sess?.user_id) return null;

      const newMember: Pick<GroupMembersSchemaType, "group_id" | "user_id"> = {
        group_id: input,
        user_id: sess.user_id,
      };

      return await ctx.api.groupMembers.addNewMember(newMember);
    }),

  leaveGroup: publicProcedure
    .input(typeboxInput<MemberToRemoveSchemaType>(CompiledMemberToRemoveSchema))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.can("leave group", input.group_id) || !ctx.user?.id) {
        throw new TRPCResolverError(
          403,
          "Current user denied permission to delete this member",
        );
      }

      return await ctx.api.groupMembers.removeMember(
        ctx.user.id,
        input.group_id,
      );
    }),

  getViewerRole: publicProcedure
    .input(
      typeboxInput<GroupIDForInsertSchemaType>(GroupIDForInsertSchemaValidator),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.auth.getRoleForGroup(input);
    }),
  getGroupMembers: publicProcedure
    .input(
      typeboxInput<GroupIDForInsertSchemaType>(GroupIDForInsertSchemaValidator),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.groupMembers.getGroupMembers(input);
    }),

  viewerMemberships: publicProcedure.mutation(async ({ ctx }) => {
    const user_id = ctx.user?.id;

    if (!user_id) return null;

    const memberships =
      await ctx.api.groupMembers.getViewerMemberships(user_id);

    return memberships;
  }),

  getGroupOrganizerEmail: publicProcedure
    .input(
      typeboxInput<GroupIDForInsertSchemaType>(GroupIDForInsertSchemaValidator),
    )
    .mutation(async ({ ctx, input }) => {
      const organizerId = await ctx.api.groupMembers.getOrganizer(input);

      return await ctx.serviceclient.getEmailById(organizerId);
    }),
});

export { groupMembersRouter };
