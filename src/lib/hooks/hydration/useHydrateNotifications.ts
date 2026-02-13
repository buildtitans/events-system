"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { populateNewNotifications } from "../../store/slices/notifications/notificationSlice";
import { trpcClient } from "@/src/trpc/trpcClient";

export const useHydrateNotifications = () => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (userKind === "anonymous") return;

        const hydrateNotifications = async () => {
            dispatch(populateNewNotifications({ status: "pending" }))

            const notifications = await trpcClient.notifications.getNotifications.mutate();

            if (Array.isArray(notifications) && notifications.length > 0) {
                dispatch(populateNewNotifications({ status: "ready", data: notifications }))
            }
        };

        void hydrateNotifications();

    }, [userKind]);
};