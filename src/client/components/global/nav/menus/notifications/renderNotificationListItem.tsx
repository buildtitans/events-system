"use client";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import type { JSX } from "react";
import type { UserNotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import NotificationListItem from "./notificationListItem";

type Props = {
  notification: UserNotificationSchemaType;
  handleClick: (groupSlug: GroupSchemaType["slug"]) => void;
};

export default function RenderNotificationListItem({
  notification,
  handleClick,
}: Props): JSX.Element {
  switch (notification.kind) {
    case "new":
      return (
        <NotificationListItem
          notification={notification}
          handleClick={handleClick}
          icon={<NotificationsActiveIcon titleAccess="New notification" />}
        />
      );
    case "seen":
      return (
        <NotificationListItem
          notification={notification}
          handleClick={handleClick}
          icon={
            <NotificationsNoneIcon
              titleAccess="Seen notification"
              sx={{ opacity: 0.5 }}
            />
          }
        />
      );
    default:
      return assertNever(notification);
  }
}
