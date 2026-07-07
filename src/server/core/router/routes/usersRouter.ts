import {
  router,
  protectedProcedure,
  publicProcedure,
} from "@/src/server/core/context/init";
import {
  TokenAndPasswordValidator,
  UserEmailInputValidator,
} from "../inputValidators/inputValidation";

const selectUserRouter = router({
  email: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getEmailById(ctx.req.user?.id);
  }),

  memberships: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getMemberships(
      ctx.req.user?.id,
    );
  }),

  rsvps: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.rsvps.getRsvpdEvents(
      ctx.req.user?.id,
    );
  }),

  createdGroups: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getGroupsCreated(
      ctx.req.user?.id,
    );
  }),
});

const userCredentialsRouter = router({
  requestPasswordReset: publicProcedure
    .input(UserEmailInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.session.emailForPwReset(input);
    }),

  resetPassword: publicProcedure
    .input(TokenAndPasswordValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.session.resetPassword(
        input.token,
        input.password,
      );
    }),
});

export const userRouter = router({
  select: selectUserRouter,
  credentials: userCredentialsRouter,
});
