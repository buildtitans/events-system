"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { resetUserPassword } from "@/src/lib/store/slices/user/thunks";

type ResetPasswordValues = {
  password: string;
  confirmPassword: string;
};

const MIN_PASSWORD_LENGTH = 8;

export const useResetPassword = (token: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const resetState = useSelector((state: RootState) => state.user.pwReset);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
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

  const resetPassword = async ({ password }: ResetPasswordValues) => {
    if (!token) return;

    const result = await dispatch(
      resetUserPassword({ newPassword: password, token }),
    ).unwrap();

    if (result.ok) router.push("/");
  };

  return {
    fields: {
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
    isPending: isSubmitting || resetState.status === "pending",
    isComplete: resetState.status === "ready",
    onSubmit: handleSubmit(resetPassword),
  };
};
