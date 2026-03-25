import { createValidator } from "@/src/lib/utils/validation/validateSchema";
import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const LoginCredentialsSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

const AuthenticationSchema = Type.Object({
  success: Type.Boolean(),
  attendanceDict: Type.Object({ record: Type.String() }),
});

type LoginCredentialsSchemaType = Static<typeof LoginCredentialsSchema>;

export type AuthenticationSchemaType = Static<typeof AuthenticationSchema>;

export { LoginCredentialsSchema };

export type { LoginCredentialsSchemaType };

export const CompiledLoginCredentials = TypeCompiler.Compile(
  LoginCredentialsSchema,
);

export const AuthenticationSchemaValidator =
  TypeCompiler.Compile(AuthenticationSchema);

export const validateLoginInput = createValidator(
  LoginCredentialsSchema,
  "LoginCredentialsSchema",
);
