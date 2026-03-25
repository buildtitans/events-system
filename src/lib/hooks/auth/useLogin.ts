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
import { getAttendanceDictionary } from "../../store/slices/viewer/PermissionsSlice";
import { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";
import { wait } from "../../utils/rendering/wait";
import { useState } from "react";

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
    await wait(1000);
    setStatus(result.status);
    await handleLoginResult(result);
  };

  return {
    handleSubmit,
    status: status,
  };
};

export { useLogin };
