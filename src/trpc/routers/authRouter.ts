import { router, publicProcedure } from "../init";
import type { LoginCredentialsSchemaType, AuthenticationSchemaType } from "@/src/schemas/loginCredentialsSchema";
import { CompiledLoginCredentials, AuthenticationSchemaValidator } from "@/src/schemas/loginCredentialsSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";

export const authRouter = router({
    login:
        publicProcedure
            .input(
                typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials)
            )
            .output(
                typeboxInput<AuthenticationSchemaType>(AuthenticationSchemaValidator)
            )
            .mutation(async ({ ctx, input }) => {

                return ctx.api.auth.login(
                    {
                        input_email: input.email,
                        input_password: input.password
                    }
                )
            }),

    signout: publicProcedure
        .output(typeboxInput<AuthenticationSchemaType>(AuthenticationSchemaValidator))
        .mutation(async ({ ctx }) => {

            return ctx.api.auth.logout()
        })
})