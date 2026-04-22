import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { resetPassword } from "../../store/slices/user/userSlice";
import React, { useMemo, useState } from "react";
import {
  enqueueAlert,
  enqueueDrawer,
} from "../../store/slices/rendering/RenderingSlice";
import { useRouter } from "next/navigation";

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

    dispatch(resetPassword({ status: "pending" }));

    try {
      const res = await trpcClient.users.resetUserPassword.mutate({
        password: newPassword.password,
        token,
      });

      dispatch(resetPassword({ status: "ready", data: res }));
      dispatch(enqueueAlert({ kind: "success", action: "passwordReset" }));
      router.push("/");
      dispatch(enqueueDrawer("sign in drawer"));
    } catch (err) {
      console.error(err);
      dispatch(resetPassword({ status: "failed", error: `${err}` }));
      dispatch(enqueueAlert({ kind: "error", action: "passwordReset" }));
    }
  };

  return {
    submitPwReset,
    getInput,
    errors,
    isSubmittable,
  };
};
