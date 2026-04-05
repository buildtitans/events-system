import { validateLoginInput } from "@/src/schemas/auth/loginCredentialsSchema";

export function validateLoginCredentials(
  emailInput: string,
  passwordInput: string,
) {
  const trimmedEmail = emailInput.trim().toLowerCase();

  return validateLoginInput({ email: trimmedEmail, password: passwordInput });
}
