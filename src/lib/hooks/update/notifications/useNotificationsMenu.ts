"use client";
import { useCallback, useMemo, useState } from "react";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { MouseEvent } from "react";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { useDispatch, useSelector } from "react-redux";
import { markOpenedNotifications } from "@/src/lib/store/slices/notifications/thunks";
import { useRouter } from "next/navigation";
import { slugByGroupId } from "../../../utils/rendering/slugByGroupId";

export const useNotificationsMenu = () => {
  const router = useRouter();
  const groups = useSelector((s: RootState) => s.groups.communities);
  const notifications = useSelector(
    (s: RootState) => s.notifications.notifications,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const newNotifications = useMemo(() => {
    return notifications.status === "ready" ? notifications.data.new : [];
  }, [notifications]);

  const lookup = useMemo(() => {
    return slugByGroupId({ groups, notifications: newNotifications });
  }, [groups, newNotifications]);

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

  const handleClick = useCallback(
    (group_id: GroupSchemaType["id"]) => {
      const groupSlug = lookup[group_id];

      if (groupSlug === undefined) return;

      const location = `/group/${groupSlug}`;
      router.push(location);
    },
    [lookup, router],
  );

  return {
    notifications,
    newNotifications,
    unreadCount: newNotifications.length,
    props: {
      open: Boolean(anchorEl),
      anchorEl,
      handleClose,
      handleClick,
    },
    handleOpen,
  };
};
