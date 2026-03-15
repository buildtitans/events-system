import { router, publicProcedure } from "@/src/server/src/context/init";
import type { LoginCredentialsSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import { CompiledLoginCredentials } from "@/src/schemas/auth/loginCredentialsSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";

export const authRouter = router({
  login: publicProcedure
    .input(typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.services.api.domains.session.login(
        input.email,
        input.password,
      );

      ctx.session.setCookieHeader(result);

      const lookupMap =
        await ctx.services.api.domains.users.getRoleBasedLayoutMap(
          result.user.id,
        );

      const attendanceDictionary =
        await ctx.services.api.domains.participations.getAttendanceDictionary(
          result.user.id,
        );

      return {
        ok: result.ok,
        email: result.user.email,
        lookupMap,
        attendanceDictionary,
      };
    }),

  signout: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.session.logout(
      ctx.req.cookies.session,
    );
  }),

  signup: publicProcedure
    .input(typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.users.createNewUser(
        input.email,
        input.password,
      );
    }),

  recover: publicProcedure.mutation(async ({ ctx }) => {
    const session = await ctx.services.api.domains.session.recoverSession(
      ctx.req.cookies.session,
    );

    if (!session) {
      ctx.session.removeCookieHeader();
      return null;
    }

    const [email, permissions] = await Promise.all([
      ctx.services.api.domains.users.getEmailById(session.user_id),
      ctx.services.api.domains.users.getRoleBasedLayoutMap(session.user_id),
    ]);

    return {
      session,
      email,
      permissions,
    };
  }),

  checkSession: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.session.recoverSession(
      ctx.req.cookies.session,
    );
  }),
});
