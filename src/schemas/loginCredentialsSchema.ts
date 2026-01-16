import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const LoginCredentialsSchema = Type.Object({
    email: Type.String(),
    password: Type.String()
});

const AuthenticationSchema = Type.Object({
    success: Type.Boolean()
});

type LoginCredentialsSchemaType = Static<typeof LoginCredentialsSchema>;

export type AuthenticationSchemaType = Static<typeof AuthenticationSchema>;

export { LoginCredentialsSchema };

export type { LoginCredentialsSchemaType };

export const CompiledLoginCredentials = TypeCompiler.Compile(LoginCredentialsSchema);

export const AuthenticationSchemaValidator = TypeCompiler.Compile(AuthenticationSchema);