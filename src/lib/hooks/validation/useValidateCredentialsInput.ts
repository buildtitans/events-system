"use client";
import { SetStateAction } from "react";
import { emailFormat } from "../../utils/regex/regex";
import type {
  ValidationState,
  LoginCredentials,
} from "../../types/tokens/types";

import type {
  UseLoginHook,
  ValidateCredentialsHook,
} from "../../types/hooks/types";

export const useValidateCredentials = (
  credentials: LoginCredentials,
  setCredentials: React.Dispatch<SetStateAction<LoginCredentials>>,
  status: UseLoginHook["status"],
): ValidateCredentialsHook => {
  const getValidationState = (
    email: string,
    password: string,
  ): {
    emailError: ValidationState;
    passwordError: ValidationState;
  } => {
    const hasEmailInput = email.length > 0;
    const hasPasswordInput = password.length > 0;
    const invalidEmailFormat = hasEmailInput && !emailFormat.test(email);
    const invalidPassword = hasPasswordInput && password.length < 6;

    const emailError: ValidationState = {
      hasError: invalidEmailFormat,
      message: invalidEmailFormat ? "Please provide a valid email" : "",
    };

    const passwordError: ValidationState =
      status === "failed" && hasEmailInput && hasPasswordInput
        ? {
            hasError: true,
            message: "Invalid password or email",
          }
        : {
            hasError: invalidPassword,
            message: invalidPassword
              ? "Password needs to be at least 6 characters"
              : "",
          };

    return { emailError, passwordError };
  };

  const setField =
    (field: keyof LoginCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setCredentials((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleEmail = setField("email");
  const handlePassword = setField("password");

  const { emailError, passwordError } = getValidationState(
    credentials.email,
    credentials.password,
  );

  return {
    isSubmittable: !!credentials.email && !!credentials.password,
    emailErrorMessage: emailError.message,
    emailError: emailError.hasError,
    passwordError: passwordError.hasError,
    passwordErrorMessage: passwordError.message,
    handleEmail,
    handlePassword,
  };
};
