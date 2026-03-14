import { router, publicProcedure } from "@/src/server/src/context/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import {
  GroupIDForInsertSchemaType,
  GroupIDForInsertSchemaValidator,
  MemberToRemoveInputValidator,
} from "@/src/schemas/groups/groupMembersSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";

export const groupIdInputValidator = typeboxInput<GroupIDForInsertSchemaType>(
  GroupIDForInsertSchemaValidator,
);

const groupMembersRouter = router({
  addNewMember: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      const token = ctx.req.cookies.session;
      if (!token) return null;
      const sess = await ctx.api.auth.getSession(token);
      if (!sess?.user_id) return null;

      const newMember: Pick<GroupMemberSchemaType, "group_id" | "user_id"> = {
        group_id: input,
        user_id: sess.user_id,
      };

      return await ctx.api.groupMembers.addNewMember(newMember);
    }),

  leaveGroup: publicProcedure
    .input(MemberToRemoveInputValidator)
    .mutation(async ({ ctx, input }) => {
      const contextProvider = await ctx;
      const result = await contextProvider.service.api.groups.

      return (await ctx).service.api

      return await ctx.api.groupMembers.removeMember(
        ctx.user.id,
        input.group_id,
      );
    }),

  getViewerRole: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return (await ctx).service.api.participations.getRoleInGroup(input);
    }),
  getGroupMembers: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return (await ctx).service.api.
    }),

  viewerMemberships: publicProcedure.mutation(async ({ ctx }) => {
    const user_id = ctx.user?.id;

    if (!user_id) {
      throw new TRPCResolverError(
        403,
        "Permission to access membership data denied",
      );
    }

    return await ctx.api.groupMembers.getViewerMemberships(user_id);
  }),

  getGroupOrganizerEmail: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      const organizerId = await ctx.api.groupMembers.getOrganizer(input);
      return await ctx.services.userClient.getEmailById(organizerId);
    }),
});

export { groupMembersRouter };
