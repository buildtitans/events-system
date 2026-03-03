"use client";
import { useCallback, useMemo, useState } from "react";
import { emailFormat } from "@/src/lib/utils/regex/regex";
import { wait } from "../../utils/rendering/wait";
import { ValidateSignupCredsHook } from "../../types/hooks/types";

const MIN_PW_LENGTH = 8;

export type SignupCredentialsType = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type InputErrorsType = {
  invalidEmail: "" | "Please enter a valid email";
  invalidPassword: "" | `Password must be at least 8 characters`;
  needPasswordConfirmation: "" | "Password must match";
};

export const useValidateSignupCredentials = (): ValidateSignupCredsHook => {
  const [credentials, setCredentials] = useState<SignupCredentialsType>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [inputErrors, setInputErrors] = useState<InputErrorsType>({
    invalidEmail: "",
    invalidPassword: "",
    needPasswordConfirmation: "",
  });

  const isValidated = useMemo(() => {
    const metRequiredFields =
      (credentials.email !== "" && credentials.password !== "") ||
      credentials.confirmPassword !== "";

    const isValid =
      inputErrors.invalidEmail === "" &&
      inputErrors.invalidPassword === "" &&
      inputErrors.needPasswordConfirmation === "";

    return metRequiredFields && isValid;
  }, [
    inputErrors,
    credentials.email,
    credentials.password,
    credentials.confirmPassword,
  ]);

  const validateEmail = useCallback(
    (input: string) => {
      const valid = emailFormat.test(input);

      if (!valid) {
        setInputErrors((prev: InputErrorsType) => ({
          ...prev,
          invalidEmail: "Please enter a valid email",
        }));
      } else if (
        valid &&
        inputErrors.invalidEmail === "Please enter a valid email"
      ) {
        setInputErrors((prev: InputErrorsType) => ({
          ...prev,
          invalidEmail: "",
        }));
      }
    },
    [inputErrors.invalidEmail],
  );

  const validatePassword = useCallback(
    (input: string) => {
      const invalidPassword = !input || input.length < MIN_PW_LENGTH;

      if (invalidPassword) {
        setInputErrors((prev: InputErrorsType) => ({
          ...prev,
          invalidPassword: `Password must be at least ${MIN_PW_LENGTH} characters`,
        }));
      } else if (!invalidPassword && inputErrors.invalidPassword !== "") {
        setInputErrors((prev: InputErrorsType) => ({
          ...prev,
          invalidPassword: "",
        }));
      }
    },
    [inputErrors.invalidPassword],
  );

  const confirmPassword = useCallback(
    (pw: string, confirmPw: string) => {
      const matches = pw === confirmPw;
      switch (matches) {
        case true: {
          if (matches && inputErrors.needPasswordConfirmation !== "") {
            setInputErrors((prev: InputErrorsType) => ({
              ...prev,
              needPasswordConfirmation: "",
            }));
          }
          return;
        }
        case false: {
          setInputErrors((prev: InputErrorsType) => ({
            ...prev,
            needPasswordConfirmation: "Password must match",
          }));
        }

        default: {
          return;
        }
      }
    },
    [
      inputErrors.needPasswordConfirmation,
      credentials.password,
      credentials.confirmPassword,
    ],
  );

  const handleEmailInput = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const value = e.target.value;

      setCredentials((prev: SignupCredentialsType) => ({
        ...prev,
        email: value,
      }));
      await wait(300);
      validateEmail(credentials.email);
    },
    [credentials.email],
  );

  const handlePasswordInput = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const value = e.target.value;

      const trimmed = value.trim();

      setCredentials((prev: SignupCredentialsType) => ({
        ...prev,
        password: trimmed,
      }));

      await wait(300);

      validatePassword(credentials.password);
    },
    [credentials.password],
  );

  const handleConfirmingPassword = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const value = e.target.value;

      const trimmed = value.trim();

      setCredentials((prev: SignupCredentialsType) => ({
        ...prev,
        confirmPassword: trimmed,
      }));

      await wait(300);

      confirmPassword(credentials.password, credentials.confirmPassword);
    },
    [credentials.password, credentials.confirmPassword],
  );

  return {
    handleEmailInput,
    handlePasswordInput,
    handleConfirmingPassword,
    password: credentials.password,
    email: credentials.email,
    errors: inputErrors,
    isValidated: isValidated,
  };
};
