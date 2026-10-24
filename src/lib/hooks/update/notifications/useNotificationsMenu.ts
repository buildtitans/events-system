"use client";
import { useCallback, useMemo, useState } from "react";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { MouseEvent } from "react";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { UserNotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  markOpenedNotifications,
  refreshNotifications,
} from "@/src/lib/store/slices/notifications/thunks";
import { useRouter } from "next/navigation";

export const useNotificationsMenu = () => {
  const router = useRouter();
  const notifications = useSelector(
    (s: RootState) => s.notifications.notifications,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const newNotifications = useMemo(() => {
    return notifications.status === "ready" ? notifications.data.new : [];
  }, [notifications]);

  const newAndSeen = useMemo(() => {
    let notifs: UserNotificationSchemaType[] = [];
    if (notifications.status === "ready") {
      notifs = [...notifications.data.new, ...notifications.data.seen];
    }
    return notifs;
  }, [notifications]);

  const handleOpen = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const markNotificationsSeen = async () => {
    await dispatch(markOpenedNotifications(newNotifications));
    await dispatch(refreshNotifications());
  };

  const handleClose = async () => {
    setAnchorEl(null);

    if (newNotifications.length > 0) {
      await markNotificationsSeen();
    }
  };

  const handleClick = useCallback(
    (groupSlug: GroupSchemaType["slug"]) => {
      const location = `/group/${groupSlug}`;
      router.push(location);
    },
    [router],
  );

  return {
    notifications,
    newAndSeen,
    unreadCount: newNotifications.length,
    props: {
      open: Boolean(anchorEl),
      anchorEl,
      handleClose,
      handleClick,
      status: notifications.status,
    },
    handleOpen,
  };
};
