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
  forGroup: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.query.getAllGroupMembers(
        input,
      );
    }),

  role: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.memberships.getRoleInGroup(
        ctx.req.user?.id,
        input,
      );
    }),

  userMemberships: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getMemberships(
      ctx.req.user?.id,
    );
  }),

  organizerEmail: publicProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.query.getOrganizerEmail(
        input,
      );
    }),
});

const writeMembersRouter = router({
  join: protectedProcedure
    .input(groupIdInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.memberships.addMember(
        ctx.req.user?.id,
        input,
      );
    }),

  leave: publicProcedure
    .input(MemberToRemoveInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.memberships.leaveGroup(
        input.group_id,
        ctx.req.user?.id,
      );
    }),
});

export const membersRouter = router({
  select: selectMembersRouter,
  write: writeMembersRouter,
});
