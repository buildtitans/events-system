"use client";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { JSX } from "react";
import type { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import Typography from "@mui/material/Typography";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Box from "@mui/material/Box";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

type NotificationListItemProps = {
  notification: NotificationSchemaType;
  handleClick: (group_id: GroupSchemaType["id"]) => void;
};

function NotificationListItem({
  notification,
  handleClick,
}: NotificationListItemProps): JSX.Element {
  const shouldDim: boolean = notification.status === "new";

  return (
    <MenuItem
      onClick={() => handleClick(notification.group_id)}
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
      <ListItemIcon sx={{ minWidth: 34 }}>
        <NotificationsActiveIcon
          sx={{
            color: "#2196f3",
            opacity: shouldDim ? 1 : 0.5,
          }}
          fontSize="medium"
        />
      </ListItemIcon>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "start",
          gap: 1,
        }}
      >
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
          {notification.subject}:
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
          {notification.message}
        </Typography>
      </Box>
    </MenuItem>
  );
}

export default NotificationListItem;
