import { ValidationState } from "@/src/lib/types/tokens/types";
import { assertNever } from "../../assert/assertNever";
import { emailFormat } from "../../regex/regex";

type CheckFieldInputParams = {
  kind: "email" | "password";
  fieldValue: string;
  refValue: string | null;
};

export function checkFieldInput({
  kind,
  fieldValue,
  refValue,
}: CheckFieldInputParams) {
  switch (kind) {
    case "email": {
      return checkEmailValue({ fieldValue, refValue });
    }
    case "password": {
      return checkPasswordValue({ fieldValue, refValue });
    }

    default: {
      return assertNever(kind);
    }
  }
}

function checkEmailValue({
  fieldValue,
  refValue,
}: Omit<CheckFieldInputParams, "kind">) {
  const hasEmailInput =
    fieldValue.length > 0 || (refValue !== null && refValue.length > 0);
  const invalidEmailFormat = hasEmailInput && !emailFormat.test(fieldValue);

  return {
    hasError: invalidEmailFormat,
    message: invalidEmailFormat ? "Please provide a valid email" : "",
  } satisfies ValidationState;
}

function checkPasswordValue({
  fieldValue,
  refValue,
}: Omit<CheckFieldInputParams, "kind">) {
  const hasPasswordInput =
    fieldValue.length > 0 || (refValue !== null && refValue.length > 0);
  const invalidPassword = hasPasswordInput && fieldValue.length < 6;

  return {
    hasError: invalidPassword,
    message: invalidPassword
      ? "Password needs to be at least 6 characters"
      : "",
  } satisfies ValidationState;
}
