"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { loginSuccess, logout } from "@/src/lib/store/slices/auth/AuthSlice";
import { storeUserEmail } from "@/src/lib/store/slices/user/userSlice";
import { clearNotificationSlice } from "@/src/lib/store/slices/notifications/notificationSlice";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { HydrateUserService } from "@/src/lib/store/services/hydration/hydrateUserService";
import {
  clearPermissionsSlice,
  getAttendanceDictionary,
} from "@/src/lib/store/slices/viewer/ViewerSlice";
const service = new HydrateUserService(trpcClient);

const useRecoverSession = (): void => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeRecoverSession = async (): Promise<void> => {
      try {
        const session = await service.recoverSession();

        if (!session?.email) {
          dispatch(logout());
          dispatch(clearNotificationSlice());
          dispatch(clearPermissionsSlice());
          return;
        }

        dispatch(storeUserEmail({ status: "ready", data: session.email }));
        dispatch(loginSuccess());
      } catch (error) {
        logCaughtError("useRecoverSession.recoverSession()", error);
        dispatch(logout());
        dispatch(clearNotificationSlice());
        dispatch(clearPermissionsSlice());
        return;
      }

      try {
        const attendance = await service.attendance();
        dispatch(getAttendanceDictionary(attendance));
      } catch (error) {
        logCaughtError("useRecoverSession.hydrateAttendance()", error);
      }
    };

    void executeRecoverSession();
  }, [dispatch]);
};

export { useRecoverSession };
