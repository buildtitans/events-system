import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/core/context/init";
import {
  MemberToRemoveInputValidator,
  groupIdInputValidator,
} from "../inputValidators/inputValidation";

const selectMembersRouter = router({
  role: publicProcedure
    .input(groupIdInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.memberships.getRoleInGroup(
        ctx.req.user?.id,
        input,
      );
    }),

  memberships: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.users.memberships(ctx.req.user?.id);
  }),
});

const writeMembersRouter = router({
  join: protectedProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.memberships.addMember(
        ctx.req.user?.id,
        input,
      );
    }),

  leave: publicProcedure
    .input(MemberToRemoveInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.memberships.leaveGroup(
        input.group_id,
        ctx.req.user?.id,
      );
    }),
});

export const membersRouter = router({
  select: selectMembersRouter,
  write: writeMembersRouter,
});
