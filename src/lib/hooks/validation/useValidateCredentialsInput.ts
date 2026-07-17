"use client";
import { useCallback } from "react";
import { emailFormat } from "@/src/lib/utils/regex/regex";
import type {
  ValidationState,
  LoginCredentials,
  HTMLInputField,
  ValidateCredentialsHookArgs,
} from "@/src/lib/types/tokens/types";
import type {
  ValidateCredentialsHook,
  CredentialsInputErrors,
} from "@/src/lib/types/hooks/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const useValidateCredentials = ({
  credentials,
  setCredentials,
}: ValidateCredentialsHookArgs): ValidateCredentialsHook => {
  const authState = useSelector((s: RootState) => s.auth.authenticationState);

  function passwordValidation(password: LoginCredentials["password"]) {
    const hasPasswordInput = password.length > 0;
    const invalidPassword = hasPasswordInput && password.length < 6;

    const passwordError: ValidationState = {
      hasError: invalidPassword,
      message: invalidPassword
        ? "Password needs to be at least 6 characters"
        : "",
    };

    return passwordError;
  }

  function emailValidation(email: LoginCredentials["email"]) {
    const hasEmailInput = email.length > 0;
    const invalidEmailFormat = hasEmailInput && !emailFormat.test(email);

    return {
      hasError: invalidEmailFormat,
      message: invalidEmailFormat ? "Please provide a valid email" : "",
    };
  }

  function validateInput(credentials: LoginCredentials) {
    const { email, password } = credentials;

    const emailError = emailValidation(email);
    const passwordError = passwordValidation(password);

    return {
      emailError,
      passwordError,
    };
  }

  const setField = useCallback(
    (field: keyof LoginCredentials) => (e: HTMLInputField) => {
      const value = e.target.value;
      setCredentials((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [setCredentials],
  );

  const handleEmail = setField("email");
  const handlePassword = setField("password");

  const { emailError, passwordError } = validateInput(credentials);

  const inputErrors = {
    emailErrorMessage: emailError.message,
    emailError: emailError.hasError,
    passwordError: passwordError.hasError,
    passwordErrorMessage: passwordError.message,
  } satisfies CredentialsInputErrors;

  return {
    isSubmittable: !!credentials.email && !!credentials.password,
    errors: { inputErrors, authError: authState },
    handleEmail,
    handlePassword,
  };
};
