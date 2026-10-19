import { validateRouterInput } from "@/src/server/core/router/adaptors/validateRouterInput";
import {
  EmailSchema,
  LoginCredentialsSchema,
  TokenAndPasswordSchema,
} from "@/src/schemas/auth/loginCredentialsSchema";
import { router, publicProcedure } from "@/src/server/core/context/init";
import { InvalidCredentialsError } from "@/src/server/core/lib/errors/invalidCredentialsError";
import { TRPCError } from "@trpc/server";

const sessionRouter = router({
  login: publicProcedure
    .input(validateRouterInput(LoginCredentialsSchema))
    .mutation(async ({ ctx, input }) => {
      let result: Awaited<
        ReturnType<typeof ctx.api.services.domains.session.login>
      >;

      try {
        result = await ctx.api.services.domains.session.login(
          input.email,
          input.password,
        );
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
            cause: error,
          });
        }

        throw error;
      }

      ctx.session.setCookieHeader(result.session, result.user);

      return {
        status: result.status,
        email: result.user.email,
      };
    }),

  signout: publicProcedure.mutation(async ({ ctx }) => {
    const res = await ctx.api.services.domains.session.logout(
      ctx.req.cookies.session,
    );

    ctx.session.removeCookieHeader();

    return res;
  }),
});

const writeAuthRouter = router({
  signup: publicProcedure
    .input(validateRouterInput(LoginCredentialsSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.session.signUp(input);
    }),

  requestPasswordReset: publicProcedure
    .input(validateRouterInput(EmailSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.session.emailForPwReset(input);
    }),

  resetPassword: publicProcedure
    .input(validateRouterInput(TokenAndPasswordSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.session.resetPassword(
        input.token,
        input.password,
      );
    }),
});

const statusRouter = router({
  recover: publicProcedure.query(async ({ ctx }) => {
    const session = await ctx.api.services.domains.session.recoverSession(
      ctx.req.cookies.session,
    );

    if (!session) {
      ctx.session.removeCookieHeader();
      return null;
    }

    const email = await ctx.api.services.domains.users.select.email(
      ctx.req.user?.id,
    );

    return {
      session,
      email,
    };
  }),

  checkSession: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.session.recoverSession(
      ctx.req.cookies.session,
    );
  }),
});

export const authRouter = router({
  status: statusRouter,
  session: sessionRouter,
  write: writeAuthRouter,
});
