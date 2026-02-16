import { router, publicProcedure } from "../init";
import type { LoginCredentialsSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import { CompiledLoginCredentials } from "@/src/schemas/auth/loginCredentialsSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";

export const authRouter = router({
    login:
        publicProcedure
            .input(
                typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials)
            )
            .mutation(async ({ ctx, input }) => {


                const res = await ctx.api.auth.login(
                    input.email,
                    input.password
                );
                const { session, user } = res;

                ctx.reply.setCookie("session", session.id, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === "production",
                    expires: new Date(session.expires_at),
                })

                ctx.user = {
                    id: user.id,
                    role: "user"
                };

                return res ? { success: true } : { success: false }
            }),

    signout:
        publicProcedure
            .mutation(async ({ ctx }) => {

                const token = ctx
                    .req
                    .cookies
                    .session;

                if (!token) return null;

                const res = await ctx
                    .api
                    .auth
                    .logOut(token);

                if (res) {
                    ctx
                        .reply
                        .clearCookie("session");
                };

                return res;
            }),

    recover:
        publicProcedure
            .mutation(async ({ ctx }) => {

                const token = ctx.req.cookies.session;

                if (!token) return null;

                const session = await ctx.api.auth.getSession(token);

                if (!session) {
                    ctx.reply.clearCookie("session");
                    return undefined;
                };
                ctx.user = { id: session.user_id, role: 'user' };

                return session;
            }),

    session: publicProcedure.mutation(async ({ ctx }) => {

        const token = ctx.req.cookies.session;

        if (!token) return null;

        const session = await ctx.api.auth.getSession(token)

        return session

    })



})