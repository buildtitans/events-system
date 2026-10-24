"use client";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { type ReactNode, JSX } from "react";
import type { UserNotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

type NotificationListItemProps = {
  notification: UserNotificationSchemaType;
  icon: ReactNode;
  handleClick: (groupSlug: GroupSchemaType["slug"]) => void;
};

function NotificationListItem({
  notification,
  handleClick,
  icon,
}: NotificationListItemProps): JSX.Element {
  return (
    <MenuItem
      onClick={() => handleClick(notification.meta.group_slug)}
      divider
      sx={{
        paddingY: 1.25,
        paddingX: 1.25,
        display: "flex",
        alignContent: "start",
        justifyContent: "start",
        borderRadius: 2,
        color: "rgba(255, 255, 255, 0.88)",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.06)",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 34 }}>{icon}</ListItemIcon>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "start",
          gap: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: "#9acff5", fontWeight: 600 }}>
          {notification.meta.group_name}
        </Typography>
        <Typography
          fontStyle={"oblique"}
          component={"h4"}
          sx={{
            fontSize: "15px",
            color: "rgba(255, 255, 255, 0.92)",
            textWrap: "wrap",
            fontWeight: 500,
          }}
        >
          {notification.data.subject}:
        </Typography>

        <Typography
          component={"p"}
          sx={{
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.72)",
            textWrap: "wrap",
            fontWeight: 400,
          }}
        >
          {notification.data.message}
        </Typography>
      </Box>
    </MenuItem>
  );
}

export default NotificationListItem;
