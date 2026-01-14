import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const LoginCredentialsSchema = Type.Object({
    email: Type.String(),
    password: Type.String()
});

type LoginCredentialsSchemaType = Static<typeof LoginCredentialsSchema>;

export { LoginCredentialsSchema };

export type { LoginCredentialsSchemaType };

export const CompiledLoginCredentials = TypeCompiler.Compile(LoginCredentialsSchema);