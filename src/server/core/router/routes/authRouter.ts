import { router, publicProcedure } from "@/src/server/core/context/init";
import type { LoginCredentialsSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import { CompiledLoginCredentials } from "@/src/schemas/auth/loginCredentialsSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { InvalidCredentialsError } from "../../lib/errors/invalidCredentialsError";
import { TRPCError } from "@trpc/server";

const sessionRouter = router({
  login: publicProcedure
    .input(typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials))
    .mutation(async ({ ctx, input }) => {
      let result: Awaited<
        ReturnType<typeof ctx.services.api.domains.session.login>
      >;

      try {
        result = await ctx.services.api.domains.session.login(
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
    const res = await ctx.services.api.domains.session.logout(
      ctx.req.cookies.session,
    );

    ctx.session.removeCookieHeader();

    return res;
  }),
});

const writeAuthRouter = router({
  signup: publicProcedure
    .input(typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.users.createNewUser(
        input.email,
        input.password,
      );
    }),
});

const statusRouter = router({
  recover: publicProcedure.query(async ({ ctx }) => {
    const session = await ctx.services.api.domains.session.recoverSession(
      ctx.req.cookies.session,
    );

    if (!session) {
      ctx.session.removeCookieHeader();
      return null;
    }

    const email = await ctx.services.api.domains.users.getEmailById(
      session.user_id,
    );

    return {
      session,
      email,
    };
  }),

  checkSession: publicProcedure.query(async ({ ctx }) => {
    return await ctx.services.api.domains.session.recoverSession(
      ctx.req.cookies.session,
    );
  }),
});

export const authRouter = router({
  status: statusRouter,
  session: sessionRouter,
  write: writeAuthRouter,
});
