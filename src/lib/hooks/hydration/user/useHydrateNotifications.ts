"use client";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/lib/store";
import { populateNewNotifications } from "@/src/lib/store/slices/notifications/notificationSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { HydrateUserService } from "@/src/lib/store/services/hydration/hydrateUserService";

export const useHydrateNotifications = () => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const service = useMemo(() => new HydrateUserService(trpcClient), []);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userKind === "anonymous") return;

    const hydrateNotifications = async () => {
      dispatch(populateNewNotifications({ status: "pending" }));

      const notifications = await service.notifications();

      if (Array.isArray(notifications) && notifications.length > 0) {
        dispatch(
          populateNewNotifications({
            status: "ready",
            data: { new: notifications, seen: [] },
          }),
        );
      } else {
        dispatch(
          populateNewNotifications({
            status: "ready",
            data: { new: [], seen: [] },
          }),
        );
      }
    };

    void hydrateNotifications();
  }, [userKind, dispatch, service]);
};
