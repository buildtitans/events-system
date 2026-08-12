"use client";
import { Fragment } from "react";
import Box from "@mui/material/Box";
import NotificationsList from "./notificationsList";
import NotificationBadge from "../../../../ui/badges/notificationBadge";
import { useNotificationsMenu } from "@/src/lib/hooks/update/notifications/useNotificationsMenu";

export default function Notifications() {
  const { notifications, newNotifications, props, handleOpen } =
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
          badgeContent={newNotifications.length}
          handleClick={handleOpen}
        />
      </Box>
      {notifications.status === "ready" && (
        <NotificationsList props={props} notifications={newNotifications} />
      )}
    </Fragment>
  );
}
