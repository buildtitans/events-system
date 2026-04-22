import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { resetPassword } from "../../store/slices/user/userSlice";
import React, { useState } from "react";

type NewPasswordState = {
  password: string;
  confirmPassword: string;
};

type ResetPasswordHook = {
  submitPwReset: () => Promise<void>;
  getInput: (
    field: keyof NewPasswordState,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

export const useResetPassword = (token: string): ResetPasswordHook => {
  const [newPassword, setNewPassword] = useState<NewPasswordState>({
    password: "",
    confirmPassword: "",
  });

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
    dispatch(resetPassword({ status: "pending" }));

    try {
      const res = await trpcClient.users.resetUserPassword.mutate({
        password: newPassword.password,
        token,
      });

      dispatch(resetPassword({ status: "ready", data: res }));
    } catch (err) {
      console.error(err);
      dispatch(resetPassword({ status: "failed", error: `${err}` }));
    }
  };

  return {
    submitPwReset,
    getInput,
  };
};
