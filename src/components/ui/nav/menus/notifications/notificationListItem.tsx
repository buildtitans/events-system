"use client";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { JSX } from "react";
import {
    NotificationSchemaType
} from "@/src/schemas/notifications/notificationsSchema";
import Typography from '@mui/material/Typography';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Box from "@mui/material/Box";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

type NotificationListItemProps = {
    notification: NotificationSchemaType
}

function NotificationListItem({
    notification
}: NotificationListItemProps): JSX.Element {
    const shouldDim: boolean = (notification.status === "new");

    return (
        <MenuItem divider sx={{
            paddingY: 1,
            display: 'flex',
            alignContent: 'start',
            justifyContent: "start"
        }}>
            <ListItemIcon>
                <NotificationsActiveIcon
                    sx={{
                        color: "#2196f3",
                        opacity: shouldDim
                            ? 1
                            : 0.5
                    }}
                    fontSize="medium"
                />
            </ListItemIcon>

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "start",
                gap: 1
            }}>

                <Typography
                    fontStyle={"oblique"}
                    component={"h4"}
                    sx={{
                        fontSize: '15px',
                        color: 'white',
                        textWrap: "wrap",
                        fontWeight: "light"
                    }}
                >
                    {notification.subject}:
                </Typography>

                <Typography
                    component={"p"}
                    sx={{
                        fontSize: '13px',
                        color: 'white',
                        textWrap: "wrap",
                        fontWeight: "light"
                    }}
                >
                    {notification.message}
                </Typography>
            </Box>


        </MenuItem>
    );
};

export default NotificationListItem;