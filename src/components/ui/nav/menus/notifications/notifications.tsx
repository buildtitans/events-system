"use client";
import { useMemo, useState } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import NotificationsList, { NotificationsListProps } from "./notificationsList";
import NotificationBadge from "../../../badges/notificationBadge";
import { markSeen } from "@/src/lib/store/slices/notifications/notificationSlice";
import { syncSeenNotifications } from "@/src/lib/store/sync/syncNotifications";
import ListItemSkeleton from "../../../skeletons/notificationListItemSkeleton";

export default function () {
    const notifications = useSelector((s: RootState) => s.notifications.notifications);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch<AppDispatch>();
    const notifs = useMemo(() => {
        if (notifications.status === "ready") {
            return notifications.data.new.length
        }
        return 0;
    }, [notifications]);


    const handleOpen = async (e: React.MouseEvent<HTMLElement>): Promise<void> => {
        setAnchorEl(e.currentTarget);
        if (notifications.status === "ready") {
            await syncSeenNotifications(notifications.data.new)
        }

    };

    const handleClose = (): void => {
        setAnchorEl(null);
        dispatch(markSeen())
    };

    const props: NotificationsListProps = {
        open: open,
        anchorEl: anchorEl,
        handleClose: handleClose,

    }


    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <NotificationBadge badgeContent={notifs} handleClick={handleOpen} />
            </Box>
            {(notifications.status === "ready") && <NotificationsList props={props} notifications={notifications.data.new} />}

            {(notifications.status === "pending") &&
                Array.from(
                    { length: 4 },
                    (_, index) => (
                        <ListItemSkeleton key={index} />
                    ))}

        </React.Fragment>
    );
}


