"use client";
import {
  enqueueSnackbar,
  enqueueDrawer,
  enqueueAlert,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { loginSuccess } from "../../store/slices/auth/AuthSlice";
import { wait } from "../../utils/rendering/wait";

type NewUser = {
  id: string;
  email: string;
};

export const useSignUp = (
  email: string,
  password: string,
  validated: boolean,
) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleResponse = async (res: NewUser | undefined) => {
    if (res && res.email) {
      dispatch(loginSuccess());
      dispatch(enqueueSnackbar({ kind: "signup", status: "idle" }));

      await wait(200);

      dispatch(enqueueDrawer(null));
      dispatch(enqueueAlert({ kind: "success", action: "signup" }));
    } else {
      dispatch(enqueueSnackbar({ kind: "signup", status: "failed" }));
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const res = await sendRequest();

    void handleResponse(res);
  };

  const sendRequest = useCallback(async () => {
    if (!validated) return;

    dispatch(enqueueSnackbar({ kind: "signup", status: "pending" }));

    try {
      const request = await trpcClient.auth.signup.mutate({ email, password });

      if (!request) {
        throw new Error("Unexpected error on signup request");
      }
      await wait(500);

      return request;
    } catch (error) {
      console.error(error);
    }
  }, [validated, email, password]);

  return {
    handleSubmit,
  };
};
