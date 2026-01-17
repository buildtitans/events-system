import { router, publicProcedure } from "../init";
import type { LoginCredentialsSchemaType } from "@/src/schemas/loginCredentialsSchema";
import { CompiledLoginCredentials } from "@/src/schemas/loginCredentialsSchema";
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

                ctx.user = { id: user.id, role: "user" }

                return res ? { success: true } : { success: false }
            }),

    signout: publicProcedure
        .mutation(async ({ ctx }) => {

            return ctx.api.auth.logOut()
        })
})