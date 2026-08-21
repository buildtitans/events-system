"use client";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/src/lib/store/slices/auth/thunks";
import type { AppDispatch } from "@/src/lib/store";
import type { LoginCredentials } from "@/src/lib/types/tokens/types";
import type { UseLoginHook } from "@/src/lib/types/hooks/types";
import { HydrateUserService } from "@/src/lib/store/services/hydration/hydrateUserService";
import { trpcClient } from "@/src/trpc/trpcClient";
import { getAttendanceDictionary } from "@/src/lib/store/slices/viewer/ViewerSlice";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
const service = new HydrateUserService(trpcClient);

const useLogin = (): UseLoginHook => {
  const dispatch = useDispatch<AppDispatch>();

  async function hydrateAttendance(): Promise<void> {
    try {
      const attendance = await service.attendance();
      dispatch(getAttendanceDictionary(attendance));
    } catch (err) {
      logCaughtError("useLogin.login.hydrateAttendance()", err);
    }
  }

  const login = async (credentials: LoginCredentials): Promise<void> => {
    await dispatch(authenticateUser(credentials)).unwrap();
    await hydrateAttendance();
  };

  return { login };
};

export { useLogin };
