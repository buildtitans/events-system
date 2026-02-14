"use client";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import { JSX } from "react";
import {
    NotificationSchemaType
} from "@/src/schemas/notifications/notificationsSchema";
import Typography from '@mui/material/Typography';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function NotificationListItem({ notification }: { notification: NotificationSchemaType }): JSX.Element {

    return (
        <MenuItem divider sx={{
            paddingY: 2
        }}>

            <ListItemIcon>
                <NotificationsActiveIcon sx={{
                    opacity: (notification.status === "new") ? 1 : 0.5
                }} fontSize="small" />
            </ListItemIcon>
            <Typography
                sx={{
                    fontSize: '13px',
                    color: 'white',
                    textWrap: "wrap"
                }}
            >
                {notification.message}
            </Typography>
        </MenuItem>

    )
}
