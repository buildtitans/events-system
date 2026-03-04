"use client";
import {
  enqueueSnackbar,
  enqueueDrawer,
  enqueueAlert,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import type { AuthenticationSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import { useDispatch } from "react-redux";
import { syncPermissions } from "../../store/sync/syncPermissions";
import { getViewerPermissions } from "../../store/slices/viewer/PermissionsSlice";
import type { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { loginSuccess } from "../../store/slices/auth/AuthSlice";
import { wait } from "../../utils/rendering/wait";

type NewUser = {
  id: string;
  email: string;
};

export const useSignUp = (email: string, password: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLoginResult = async (
    result: AuthenticationSchemaType,
  ): Promise<void> => {
    const { success } = result;

    dispatch(enqueueSnackbar({ kind: null, status: "idle" }));

    if (success) {
      dispatch(loginSuccess());
      const permissions = await syncPermissions();
      dispatch(getViewerPermissions(permissions));
      dispatch(enqueueDrawer(null));
      dispatch(enqueueAlert({ kind: "success", action: "signup" }));
    }
  };

  const followUpLogin = async (email: string, password: string) => {
    dispatch(enqueueSnackbar({ kind: "login", status: "pending" }));

    const loginReques = await trpcClient.auth.login.mutate({
      email: email,
      password: password,
    });
    await wait(1000);
    await handleLoginResult(loginReques);
  };

  const handleResponse = async (
    res: NewUser | undefined,
    email: string,
    password: string,
  ) => {
    if (res && res.email) {
      await wait(1500);
      await followUpLogin(email, password);
    } else {
      dispatch(enqueueSnackbar({ kind: "signup", status: "failed" }));
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const res = await sendRequest(email, password);
    await handleResponse(res, email, password);
  };

  const sendRequest = async (email: string, password: string) => {
    dispatch(enqueueSnackbar({ kind: "signup", status: "pending" }));
    const request = await trpcClient.auth.signup.mutate({ email, password });
    return request;
  };
  return {
    handleSubmit,
  };
};
