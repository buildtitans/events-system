import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const LoginCredentialsSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

const EmailSchema = Type.String({ format: "email" });

const AuthenticationSchema = Type.Object({
  success: Type.Boolean(),
  attendanceDict: Type.Object({ record: Type.String() }),
});

const TokenAndPasswordSchema = Type.Object({
  token: Type.String({ format: "uuid" }),
  password: Type.String(),
});

type TokenAndPasswordSchemaType = Static<typeof TokenAndPasswordSchema>;

type EmailSchemaType = Static<typeof EmailSchema>;

type LoginCredentialsSchemaType = Static<typeof LoginCredentialsSchema>;

export const CompiledEmailSchema = TypeCompiler.Compile(EmailSchema);

export const CompiledTokenAndPasswordSchema = TypeCompiler.Compile(
  TokenAndPasswordSchema,
);

export type AuthenticationSchemaType = Static<typeof AuthenticationSchema>;

export { LoginCredentialsSchema, EmailSchema };

export type {
  LoginCredentialsSchemaType,
  EmailSchemaType,
  TokenAndPasswordSchemaType,
};

export const CompiledLoginCredentials = TypeCompiler.Compile(
  LoginCredentialsSchema,
);

export const AuthenticationSchemaValidator =
  TypeCompiler.Compile(AuthenticationSchema);
