import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import { LoginCredentialsSchema } from "@/src/schemas/auth/loginCredentialsSchema";

export function validateLoginCredentials(
  emailInput: string,
  passwordInput: string,
) {
  const trimmedEmail = emailInput.trim().toLowerCase();

  return validateOrThrow(LoginCredentialsSchema, {
    email: trimmedEmail,
    password: passwordInput,
  });
}
