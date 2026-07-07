"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/lib/store";
import { populateNewNotifications } from "@/src/lib/store/slices/notifications/notificationSlice";
import { trpcClient } from "@/src/trpc/trpcClient";

export const useHydrateNotifications = () => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userKind === "anonymous") return;

    const hydrateNotifications = async () => {
      dispatch(populateNewNotifications({ status: "pending" }));

      const notifications = await trpcClient.notifications.select.new.mutate();

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
  }, [userKind, dispatch]);
};
