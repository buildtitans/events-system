"use client";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { emailFormat } from "@/src/lib/utils/regex/regex";
import { requestResetPassword } from "@/src/lib/store/slices/user/userSlice";
import {
  enqueueAlert,
  enqueueSnackbar,
} from "@/src/lib/store/slices/rendering/RenderingSlice";

type RequestPasswordResetValues = {
  email: string;
};

type UseRequestPasswordResetOptions = {
  onSuccess?: () => void;
};

export const useRequestPasswordReset = ({
  onSuccess,
}: UseRequestPasswordResetOptions = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const resetState = useSelector((state: RootState) => state.user.pwReset);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetValues>({
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const { ref: emailInputRef, ...emailField } = register("email", {
    required: "Email is required",
    pattern: {
      value: emailFormat,
      message: "Please enter a valid email",
    },
  });

  const requestReset = async ({ email }: RequestPasswordResetValues) => {
    dispatch(requestResetPassword({ status: "pending" }));
    dispatch(enqueueSnackbar({ kind: "pwResetEmail", status: "pending" }));

    const result =
      await trpcClient.users.credentials.requestPasswordReset.mutate(email);
    dispatch(enqueueSnackbar({ kind: "pwResetEmail", status: "idle" }));

    if (result) {
      dispatch(requestResetPassword({ status: "ready", data: result }));
      dispatch(enqueueAlert({ kind: "success", action: "resetLinkSent" }));
      reset();
      onSuccess?.();
      return;
    }

    dispatch(
      requestResetPassword({
        status: "failed",
        error: "Couldn't send email for reset",
      }),
    );
    dispatch(enqueueAlert({ kind: "error", action: "resetLinkSent" }));
  };

  return {
    emailField: {
      ...emailField,
      inputRef: emailInputRef,
    },
    emailError: errors.email?.message,
    isPending: isSubmitting || resetState.status === "pending",
    onSubmit: handleSubmit(requestReset),
  };
};
