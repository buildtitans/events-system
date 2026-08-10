"use client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { resetUserPassword } from "@/src/lib/store/slices/user/thunks";

type NewPasswordState = {
  password: string;
  confirmPassword: string;
};

type ResetPasswordHook = {
  errors: {
    invalidPassword: "" | "Password must be at least 8 characters";
    confirmPassword: "" | "Password must match";
  };
  isSubmittable: boolean;
  submitPwReset: () => Promise<void>;
  getInput: (
    field: keyof NewPasswordState,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

type ResetPasswordErrors = ResetPasswordHook["errors"];

const MIN_PASSWORD_LENGTH = 8;

export const useResetPassword = (token: string): ResetPasswordHook => {
  const [newPassword, setNewPassword] = useState<NewPasswordState>({
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const errors = useMemo<ResetPasswordErrors>(
    () => ({
      invalidPassword:
        newPassword.password !== "" &&
        newPassword.password.length < MIN_PASSWORD_LENGTH
          ? "Password must be at least 8 characters"
          : "",
      confirmPassword:
        newPassword.confirmPassword !== "" &&
        newPassword.password !== newPassword.confirmPassword
          ? "Password must match"
          : "",
    }),
    [newPassword.confirmPassword, newPassword.password],
  );

  const isSubmittable =
    token !== "" &&
    newPassword.password !== "" &&
    newPassword.confirmPassword !== "" &&
    errors.invalidPassword === "" &&
    errors.confirmPassword === "";

  const getInput = (
    field: keyof NewPasswordState,
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const input = e.target.value;
    const value = input.trim();

    setNewPassword((prev: NewPasswordState) => ({
      ...prev,
      [field]: value,
    }));
  };

  const dispatch = useDispatch<AppDispatch>();

  const submitPwReset = async () => {
    if (!isSubmittable) return;

    const result = await dispatch(
      resetUserPassword({ newPassword: newPassword.confirmPassword, token }),
    ).unwrap();

    if (result.ok) {
      router.push("/");
    }
  };

  return {
    submitPwReset,
    getInput,
    errors,
    isSubmittable,
  };
};
