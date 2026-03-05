"use client";
import { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/src/lib/store/slices/auth/AuthSlice";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { LoginCredentials } from "../../types/tokens/types";
import type { UseLoginHook } from "@/src/lib/types/hooks/types";
import {
  enqueueDrawer,
  enqueueSnackbar,
} from "../../store/slices/rendering/RenderingSlice";
import {
  getAttendanceDictionary,
  getViewerPermissions,
} from "../../store/slices/viewer/PermissionsSlice";
import { RBACType } from "@/src/server/src/db/clients/types/types";
import { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";

type LoginResType = {
  success: boolean;
  permissions: RBACType;
  attendanceDictionary: AttendanceDictionaryType;
};

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const { status } = useSelector((s: RootState) => s.rendering.snackbar);

  const dispatch = useDispatch<AppDispatch>();

  const handleLoginResult = async (result: LoginResType): Promise<void> => {
    console.log(result);

    const { success, permissions, attendanceDictionary } = result;

    dispatch(
      enqueueSnackbar({
        kind: "login",
        status: success ? "success" : "failed",
      }),
    );

    if (success) {
      dispatch(loginSuccess());
      dispatch(getViewerPermissions(permissions));
      dispatch(getAttendanceDictionary(attendanceDictionary));
      dispatch(enqueueDrawer(null));
    }

    console.log(userKind);
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResType> => {
    const result = await trpcClient.auth.login.mutate({
      email,
      password,
    });
    return result;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const { email, password } = credentials;
    if (!email || !password) return;

    dispatch(enqueueSnackbar({ kind: "login", status: "pending" }));

    const result = await login(email, password);
    await handleLoginResult(result);
  };

  useEffect(() => {
    if (userKind === "anonymous" || status === "idle") return;
  }, [userKind, status]);

  return {
    handleSubmit,
  };
};

export { useLogin };
