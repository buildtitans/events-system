"use client";
import Menu from "@mui/material/Menu";
import { JSX } from "react";
import {
    NotificationSchemaArrayType,
    NotificationSchemaType
} from "@/src/schemas/notifications/notificationsSchema";
import NotificationListItem from "./notificationListItem";
import NoPendingNotifications from "../../../fallbacks/noPendingNotifications";

export type NotificationsListProps = {
    anchorEl: null | HTMLElement,
    handleClose: () => void,
    open: boolean,
}

export type NotificationList = {
    notifications: NotificationSchemaArrayType,
    props: NotificationsListProps
}

export default function NotificationsList({
    props,
    notifications
}: NotificationList): JSX.Element {

    const {
        open,
        handleClose,
        anchorEl
    } = props;

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
                list: {
                    sx: {
                        width: 250,
                        minHeight: 180,
                        backgroundColor: '#242424',
                        height: "auto",
                        borderRadius: 2
                    }
                },
                paper: {
                    sx: {
                        maxWidth: 250,
                        maxHeight: 250,
                        height: "auto",
                        overflowX: 'hidden',
                        overflowY: "auto",
                        borderRadius: 2,
                    }

                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {(notifications.length > 0) && notifications.map((
                notification: NotificationSchemaType
            ) => (

                <NotificationListItem
                    key={notification.id}
                    notification={notification}
                />
            ))}
            {(notifications.length === 0) && <NoPendingNotifications />}

        </Menu>
    );
};

