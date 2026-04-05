"use client";
import {
  enqueueSnackbar,
  enqueueDrawer,
  enqueueAlert,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { loginSuccess } from "../../store/slices/auth/AuthSlice";
import { LoginResType } from "./useLogin";

type NewUser = {
  id: string;
  email: string;
};

export const useSignUp = (email: string, password: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLoginResult = async (result: LoginResType): Promise<void> => {
    const { status } = result;

    dispatch(enqueueSnackbar({ kind: null, status: "idle" }));

    if (status === "ok") {
      dispatch(loginSuccess());
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
    await handleLoginResult(loginReques);
  };

  const handleResponse = async (
    res: NewUser | undefined,
    email: string,
    password: string,
  ) => {
    if (res && res.email) {
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
