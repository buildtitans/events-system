"use client";
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
import { storeUserEmail } from "../../store/slices/user/userSlice";
import {
  getAttendanceDictionary,
  getViewerPermissions,
} from "../../store/slices/viewer/PermissionsSlice";
import { RBACType } from "@/src/server/src/db/clients/types/types";
import { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";

type LoginResType = {
  ok: boolean;
  email: string;
  lookupMap: RBACType;
  attendanceDictionary: AttendanceDictionaryType;
};

const useLogin = (credentials: LoginCredentials): UseLoginHook => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();

  const handleLoginResult = async (result: LoginResType): Promise<void> => {
    const { ok, lookupMap, attendanceDictionary, email } = result;

    if (ok) {
      dispatch(storeUserEmail({ status: "ready", data: email }));
      dispatch(loginSuccess());
      dispatch(getViewerPermissions(lookupMap));
      dispatch(getAttendanceDictionary(attendanceDictionary));
      dispatch(enqueueSnackbar({ kind: "login", status: "success" }));
    } else {
      dispatch(enqueueSnackbar({ kind: "login", status: "success" }));
    }

    dispatch(enqueueDrawer(null));
  };

  const login = async (email: string, password: string) => {
    const result = await trpcClient.auth.login.mutate({
      email,
      password,
    });

    console.log(result);

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

    console.log({ "User Kind": userKind });
  };

  return {
    handleSubmit,
  };
};

export { useLogin };
