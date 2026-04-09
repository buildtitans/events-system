"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/src/lib/store/slices/auth/AuthSlice";
import type { AppDispatch } from "@/src/lib/store";
import type { LoginCredentials } from "../../types/tokens/types";
import type { UseLoginHook } from "@/src/lib/types/hooks/types";
import {
  enqueueDrawer,
  enqueueSnackbar,
} from "../../store/slices/rendering/RenderingSlice";
import { storeUserEmail } from "../../store/slices/user/userSlice";
import { getAttendanceDictionary } from "../../store/slices/viewer/ViewerSlice";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { useState } from "react";

type AttendanceDictionaryType = Record<
  EventAttendantsSchemaType["event_id"],
  EventAttendantsSchemaType["status"]
>;

export type LoginResType =
  | {
      status: "ok";
      email: string;
      attendanceDictionary: AttendanceDictionaryType;
    }
  | {
      status: "failed";
      email: undefined;
      attendanceDictionary: undefined;
    };

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
  const [status, setStatus] = useState<UseLoginHook["status"]>("initial");
  const dispatch = useDispatch<AppDispatch>();

  const handleLoginResult = async (result: LoginResType): Promise<void> => {
    if (result.status === "ok") {
      const { attendanceDictionary, email } = result;

      dispatch(storeUserEmail({ status: "ready", data: email }));
      dispatch(loginSuccess());
      dispatch(getAttendanceDictionary(attendanceDictionary));
      dispatch(enqueueSnackbar({ kind: "login", status: "success" }));
      dispatch(enqueueDrawer(null));
    } else {
      dispatch(enqueueSnackbar({ kind: "login", status: "failed" }));
    }
  };

  const login = async (email: string, password: string) => {
    return await trpcClient.auth.login.mutate({
      email,
      password,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const { email, password } = credentials;
    if (!email || !password) return;

    dispatch(enqueueSnackbar({ kind: "login", status: "pending" }));

    const result = await login(email, password);
    setStatus(result.status);
    await handleLoginResult(result);
  };

  return {
    handleSubmit,
    status: status,
  };
};

export { useLogin };
