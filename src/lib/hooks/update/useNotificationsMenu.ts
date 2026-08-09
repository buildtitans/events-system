"use client";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { useState } from "react";
import type { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markOpenedNotifications } from "@/src/lib/store/slices/notifications/thunks";

export const useNotificationsMenu = () => {
  const notifications = useSelector(
    (s: RootState) => s.notifications.notifications,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const newNotifications =
    notifications.status === "ready" ? notifications.data.new : [];

  const handleOpen = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const markNotificationsSeen = async () => {
    await dispatch(markOpenedNotifications(newNotifications));
  };

  const handleClose = async () => {
    setAnchorEl(null);

    if (newNotifications.length > 0) {
      await markNotificationsSeen();
    }
  };

  return {
    notifications,
    newNotifications,
    unreadCount: newNotifications.length,
    props: {
      open: Boolean(anchorEl),
      anchorEl,
      handleClose,
    },
    handleOpen,
  };
};
