"use client";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { JSX } from "react";
import {
    NotificationSchemaType
} from "@/src/schemas/notifications/notificationsSchema";
import Typography from '@mui/material/Typography';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

type NotificationListItemProps = {
    notification: NotificationSchemaType
}

function NotificationListItem({
    notification
}: NotificationListItemProps): JSX.Element {
    const shouldDim: boolean = (notification.status === "new");

    return (
        <MenuItem divider sx={{
            paddingY: 2
        }}>
            <ListItemIcon>
                <NotificationsActiveIcon
                    sx={{
                        opacity: shouldDim
                            ? 1
                            : 0.5
                    }}
                    fontSize="small"
                />
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
    );
};

export default NotificationListItem;