import { router, publicProcedure } from "@/src/server/src/context/init";
import type { LoginCredentialsSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import { CompiledLoginCredentials } from "@/src/schemas/auth/loginCredentialsSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";

export const authRouter = router({
  login: publicProcedure
    .input(typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.service.api.session.login(
        input.email,
        input.password,
      );

      ctx.session.setCookieHeader(result);

      const lookupMap = await ctx.service.api.userClient.getRoleBasedLayoutMap(
        result.user.id,
      );

      const attendanceDictionary =
        await ctx.service.api.participations.getAttendanceDictionary(
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
    return await ctx.service.api.session.logout(ctx.req.cookies.session);
  }),

  signup: publicProcedure
    .input(typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials))
    .mutation(async ({ ctx, input }) => {
      return await ctx.service.api.userClient.createNewUser(
        input.email,
        input.password,
      );
    }),

  recover: publicProcedure.mutation(async ({ ctx }) => {
    const session = await ctx.service.api.session.recoverSession(
      ctx.req.cookies.session,
    );

    if (!session) {
      ctx.session.removeCookieHeader();
      return null;
    }

    const [email, permissions] = await Promise.all([
      ctx.service.api.userClient.getEmailById(session.user_id),
      ctx.service.api.userClient.getRoleBasedLayoutMap(session.user_id),
    ]);

    return {
      session,
      email,
      permissions,
    };
  }),

  //session check w/o header change
  checkSession: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.service.api.session.recoverSession(
      ctx.req.cookies.session,
    );
  }),
});

//recover: publicProcedure.mutation(async ({ ctx }) => {
//  const session = await ctx.service.api.session.recoverSession(
//    ctx.req.cookies.session,
//  );
//
//  if (!session) {
//    ctx.session.removeCookieHeader();
//  }
//
//  const email = await ctx.service.api.userClient.getEmailById(
//    session?.user_id,
//  );
//
//  const permissions = ctx.service.api.userClient.getRoleBasedLayoutMap(
//    session?.user_id,
//  );
//
//  return {
//    session,
//    email,
//    permissions,
//  };
//}),
