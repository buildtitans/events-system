"use client";
import Menu from "@mui/material/Menu";
import type { JSX } from "react";
import type { UserNotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import RenderNotificationListItem from "./renderNotificationListItem";
import { navMenuListSx, navMenuPaperSx } from "@/src/client/styles/sx/nav";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type NotificationsListProps = {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  open: boolean;
  handleClick: (groupSlug: GroupSchemaType["slug"]) => void;
};

export type NotificationList = {
  notifications: UserNotificationSchemaType[];
  props: NotificationsListProps;
};

export default function NotificationsList({
  props,
  notifications,
}: NotificationList): JSX.Element {
  const { open, handleClose, anchorEl, handleClick } = props;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      elevation={4}
      slotProps={{
        list: {
          sx: {
            ...navMenuListSx,
            width: 320,
            minHeight: 180,
            height: "auto",
            borderRadius: 3,
          },
        },
        paper: {
          sx: {
            ...navMenuPaperSx,
            maxWidth: 320,
            maxHeight: 320,
            height: "auto",
            overflowX: "hidden",
            overflowY: "auto",
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {notifications.map((notification) => (
        <RenderNotificationListItem
          key={notification.data.id}
          notification={notification}
          handleClick={handleClick}
        />
      ))}
    </Menu>
  );
}
