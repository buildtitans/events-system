import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/core/context/init";
import {
  MemberToRemoveInputValidator,
  groupIdInputValidator,
} from "../inputValidators/inputValidation";

const groupMembersRouter = router({
  addNewMember: protectedProcedure
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
      return await ctx.services.api.domains.groups.query.getAllGroupMembers(
        input,
      );
    }),

  viewerMemberships: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getMemberships(
      ctx.req.user?.id,
    );
  }),

  getGroupOrganizerEmail: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.query.getOrganizerEmail(
        input,
      );
    }),
});

export { groupMembersRouter };
