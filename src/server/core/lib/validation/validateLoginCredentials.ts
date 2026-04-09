import { validateLoginInput } from "./schemaValidators";

export function validateLoginCredentials(
  emailInput: string,
  passwordInput: string,
) {
  const trimmedEmail = emailInput.trim().toLowerCase();

  return validateLoginInput({ email: trimmedEmail, password: passwordInput });
}
