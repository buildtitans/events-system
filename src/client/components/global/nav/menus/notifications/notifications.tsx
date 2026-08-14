"use client";
import { Fragment } from "react";
import Box from "@mui/material/Box";
import NotificationsList from "./notificationsList";
import NotificationBadge from "../../../../ui/badges/notificationBadge";
import { useNotificationsMenu } from "@/src/lib/hooks/update/notifications/useNotificationsMenu";
import { AsyncStateRenderer } from "@/src/client/components/pipelines/async/asyncStateRenderer";
import NoPendingNotifications from "@/src/client/components/ui/feedback/fallbacks/noPendingNotifications";
import NotificationsListSkeleton from "./notificationsListSkeleton";

export default function Notifications() {
  const { notifications, newAndSeen, props, handleOpen, unreadCount } =
    useNotificationsMenu();

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          zIndex: 1500,
        }}
      >
        <NotificationBadge
          badgeContent={unreadCount}
          handleClick={handleOpen}
        />
      </Box>
      <AsyncStateRenderer
        state={notifications}
        empty={() => <NoPendingNotifications />}
        pending={() => <NotificationsListSkeleton props={props} />}
      >
        {() => <NotificationsList props={props} notifications={newAndSeen} />}
      </AsyncStateRenderer>
    </Fragment>
  );
}
