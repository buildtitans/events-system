import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/core/context/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import {
  GroupIDForInsertSchemaType,
  GroupIDForInsertSchemaValidator,
  MemberToRemoveInputValidator,
} from "@/src/schemas/groups/groupMembersSchema";

export const groupIdInputValidator = typeboxInput<GroupIDForInsertSchemaType>(
  GroupIDForInsertSchemaValidator,
);

const groupMembersRouter = router({
  addNewMember: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.memberships.addMember(
        ctx.req.user?.id,
        input,
      );
    }),

  leaveGroup: publicProcedure
    .input(MemberToRemoveInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.memberships.leaveGroup(
        input.group_id,
        ctx.req.user?.id,
      );
    }),

  getViewerRole: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.memberships.getRoleInGroup(
        ctx.req.user?.id,
        input,
      );
    }),

  getGroupMembers: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.getAllGroupMembers(input);
    }),

  viewerMemberships: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.getMemberships(
      ctx.req.user?.id,
    );
  }),

  getGroupOrganizerEmail: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.getOrganizerEmail(input);
    }),
});

export { groupMembersRouter };
