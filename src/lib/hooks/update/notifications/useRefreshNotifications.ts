"use client";
import type { RootState, AppDispatch } from "@/src/lib/store";
import { refreshNotifications } from "@/src/lib/store/slices/notifications/thunks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useRefreshNotifications = (): void => {
  const dispatch = useDispatch<AppDispatch>();
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const initialized = useSelector(
    (s: RootState) => s.notifications.initialized,
  );
  const refreshing = useSelector(
    (s: RootState) => s.notifications.isRefreshing,
  );

  useEffect(() => {
    if (userKind === "anonymous") return;

    const executeRefreshNotifications = async () => {
      if (
        document.visibilityState === "visible" &&
        initialized &&
        !refreshing
      ) {
        await dispatch(refreshNotifications());
      }
    };

    document.addEventListener("visibilitychange", executeRefreshNotifications);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        executeRefreshNotifications,
      );
    };
  }, [initialized, refreshing, userKind, dispatch]);
};
