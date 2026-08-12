"use client";

import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import type { LoginCredentials } from "@/src/lib/types/tokens/types";
import { emailFormat } from "@/src/lib/utils/regex/regex";
import { useSignUp } from "@/src/lib/hooks/auth/authenticate/useJoin";

const MIN_PASSWORD_LENGTH = 8;

type SignUpFormValues = LoginCredentials & {
  confirmPassword: string;
};

export const useSignUpForm = () => {
  const { signUp } = useSignUp();
  const authState = useSelector(
    (state: RootState) => state.auth.authenticationState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { ref: emailInputRef, ...emailField } = register("email", {
    required: "Email is required",
    pattern: {
      value: emailFormat,
      message: "Please enter a valid email",
    },
  });

  const { ref: passwordInputRef, ...passwordField } = register("password", {
    required: "Password is required",
    minLength: {
      value: MIN_PASSWORD_LENGTH,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    },
  });

  const { ref: confirmationInputRef, ...confirmationField } = register(
    "confirmPassword",
    {
      required: "Please confirm your password",
      deps: ["password"],
      validate: (confirmation, values) =>
        confirmation === values.password || "Password must match",
    },
  );

  const authError =
    authState.status === "failed"
      ? authState.error
      : authState.status === "n/a"
        ? authState.message
        : undefined;

  const onSubmit = handleSubmit(({ email, password }) =>
    signUp({ email, password }),
  );

  return {
    fields: {
      email: {
        ...emailField,
        inputRef: emailInputRef,
      },
      password: {
        ...passwordField,
        inputRef: passwordInputRef,
      },
      confirmation: {
        ...confirmationField,
        inputRef: confirmationInputRef,
      },
    },
    errors,
    authError,
    isPending: isSubmitting || authState.status === "pending",
    onSubmit,
  };
};
