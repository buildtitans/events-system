"use client";
import { SetStateAction, useEffect, useState } from "react";
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
  const [emailError, setEmailError] = useState<ValidationState>({
    hasError: false,
    message: "",
  });
  const [passwordError, setPasswordError] = useState<ValidationState>({
    hasError: false,
    message: "",
  });

  function validateInputs(email: string, password: string): void {
    const invalidEmailFormat = !emailFormat.test(email);
    const invalidPassword = !password || password.length < 6;

    setEmailError({
      hasError: invalidEmailFormat,
      message: invalidEmailFormat ? "Please provide a valid email" : "",
    });

    setPasswordError({
      hasError: invalidPassword,
      message: invalidPassword
        ? "Password needs to be at least 6 characters"
        : "",
    });
  }

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

  const setInvalidCredentialsError = (): void => {
    setPasswordError({
      hasError: true,
      message: "Invalid credentials",
    });
    return;
  };

  useEffect(() => {
    const email = credentials.email;
    const password = credentials.password;

    if (!email || !password) return;

    if (status === "failed") {
      setInvalidCredentialsError();
      return;
    }

    validateInputs(email, password);
  }, [credentials.email, credentials.password, status]);

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
