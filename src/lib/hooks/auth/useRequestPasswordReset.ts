import { trpcClient } from "@/src/trpc/trpcClient";
import {
  InputErrorsType,
  SignupCredentialsType,
} from "./useValidateSignupCredentials";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { requestResetPassword } from "../../store/slices/user/userSlice";
import {
  enqueueAlert,
  enqueueSnackbar,
} from "../../store/slices/rendering/RenderingSlice";
import React, { SetStateAction } from "react";

type RequestPasswordResetHookParameters = {
  emailError: InputErrorsType["invalidEmail"];
  email: SignupCredentialsType["email"];
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

type RequestPasswordResetHook = {
  submitPasswordResetRequest: () => Promise<void>;
};

export const useRequestPasswordReset = ({
  emailError,
  email,
  setOpen,
}: RequestPasswordResetHookParameters): RequestPasswordResetHook => {
  const dispatch = useDispatch<AppDispatch>();

  const submitPasswordResetRequest = async () => {
    if (emailError === "Please enter a valid email") {
      dispatch(enqueueAlert({ kind: "error", action: "invalidEmail" }));
      return;
    }

    dispatch(requestResetPassword({ status: "pending" }));
    dispatch(enqueueSnackbar({ kind: "pwResetEmail", status: "pending" }));

    const result = await trpcClient.users.requestPasswordReset.mutate(email);
    dispatch(enqueueSnackbar({ kind: "pwResetEmail", status: "idle" }));

    if (result) {
      dispatch(requestResetPassword({ status: "ready", data: result }));
      dispatch(enqueueAlert({ kind: "success", action: "resetLinkSent" }));
      setOpen(false);
    } else {
      dispatch(
        requestResetPassword({
          status: "failed",
          error: "Couldn't send email for reset",
        }),
      );
      dispatch(enqueueAlert({ kind: "error", action: "resetLinkSent" }));
    }
  };

  return {
    submitPasswordResetRequest,
  };
};
