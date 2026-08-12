"use client";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import type { LoginCredentials } from "@/src/lib/types/tokens/types";
import { emailFormat } from "@/src/lib/utils/regex/regex";

export const useSignInForm = () => {
  const authState = useSelector(
    (state: RootState) => state.auth.authenticationState,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const authError =
    authState.status === "failed"
      ? authState.error
      : authState.status === "n/a"
        ? authState.message
        : undefined;

  const { ref: emailInputRef, ...emailField } = register("email", {
    required: "Email is required",
    pattern: {
      value: emailFormat,
      message: "Please provide a valid email",
    },
  });
  const { ref: passwordInputRef, ...passwordField } = register("password", {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password needs to be at least 6 characters",
    },
  });

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
    },
    errors,
    authError,
    isPending: isSubmitting || authState.status === "pending",
    handleSubmit,
  };
};
