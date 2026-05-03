import {
  router,
  protectedProcedure,
  publicProcedure,
} from "@/src/server/core/context/init";
import {
  TokenAndPasswordValidator,
  UserEmailInputValidator,
} from "../inputValidators/inputValidation";

export const usersRouter = router({
  getUserEmail: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getEmailById(ctx.req.user?.id);
  }),

  userMemberships: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.getMemberships(
      ctx.req.user?.id,
    );
  }),

  rsvpsToEvents: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.getRsvpdEvents(
      ctx.req.user?.id,
    );
  }),

  createdGroups: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getGroupsCreated(
      ctx.req.user?.id,
    );
  }),

  requestPasswordReset: publicProcedure
    .input(UserEmailInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.session.emailForPwReset(input);
    }),

  resetUserPassword: publicProcedure
    .input(TokenAndPasswordValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.session.resetPassword(
        input.token,
        input.password,
      );
    }),
});
