"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { loginSuccess, logout } from "@/src/lib/store/slices/auth/AuthSlice";
import { storeUserEmail } from "@/src/lib/store/slices/user/userSlice";
import { clearNotificationSlice } from "@/src/lib/store/slices/notifications/notificationSlice";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { getCurrentRole } from "@/src/lib/store/slices/groups/OpenedGroupSlice";

const useRecoverSession = (): void => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeRecoverSession = async (): Promise<void> => {
      try {
        const result = await trpcClient.auth.status.recover.query();

        if (result.kind === "anonymous") {
          dispatch(logout());
          dispatch(clearNotificationSlice());
          dispatch(getCurrentRole("anonymous"));
          return;
        }

        const {
          data: { user },
        } = result;

        dispatch(storeUserEmail({ status: "ready", data: user.email }));
        dispatch(loginSuccess());
      } catch (error) {
        logCaughtError("useRecoverSession.recoverSession()", error);
        dispatch(logout());
        dispatch(clearNotificationSlice());
        dispatch(getCurrentRole("anonymous"));
        return;
      }
    };

    void executeRecoverSession();
  }, [dispatch]);
};

export { useRecoverSession };
