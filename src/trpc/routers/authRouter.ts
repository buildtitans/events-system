import { router, publicProcedure } from "../init";
import type { LoginCredentialsSchemaType } from "@/src/schemas/loginCredentialsSchema";
import { CompiledLoginCredentials } from "@/src/schemas/loginCredentialsSchema";
import { typeboxInput } from "../adaptors/typeBoxValidation";

export const authRouter = router({
    userByCredentials:
        publicProcedure
            .input(
                typeboxInput<LoginCredentialsSchemaType>(CompiledLoginCredentials)
            )
            .mutation(async ({ ctx, input }) => {

                return ctx.api.auth.login(
                    {
                        input_email: input.email,
                        input_password: input.password
                    }
                )
            })
})