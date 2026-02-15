"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { getGroupEvents } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect, useMemo } from "react";
import { wait } from "@/src/lib/utils/helpers/wait";
import { syncEventsForGroup } from "@/src/lib/store/sync/syncEvents";


export const useRefreshGroupEvents = () => {
    const openGroupEventsStatus = useSelector((s: RootState) => s.openGroup.events.status);
    const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
    const alert = useSelector((s: RootState) => s.rendering.alert);
    const dispatch = useDispatch<AppDispatch>();
    const group = useSelector((s: RootState) => s.openGroup.group);
    const triggerRefresh = useMemo(() => {
        const eventCreated = (alert.action === "createEvent" && alert.kind === "success");
        const eventStatusUpdated = (snackbar.kind === "changeEventScheduling" && snackbar.status === "success");

        return (eventCreated || eventStatusUpdated);
    }, [snackbar, alert]);

    useEffect(() => {
        if ((group.status !== "ready") || (!triggerRefresh) || (openGroupEventsStatus === "initial")) return;

        const executeGroupEventsRefresh = async () => {
            await wait(300);

            dispatch(getGroupEvents({ status: "refreshing" }))

            const refreshed = await syncEventsForGroup(group.data.id);

            await wait(1200);

            if (refreshed !== null) {
                dispatch(getGroupEvents({ status: "ready", data: refreshed }))
            } else {
                dispatch(getGroupEvents({
                    status: "warning",
                    message: "No events have been scheduled for this group"
                }));
            };
        };

        void executeGroupEventsRefresh();

    }, [
        openGroupEventsStatus,
        snackbar.kind,
        snackbar.status,
        alert.action,
        alert.kind,
        triggerRefresh,
        dispatch,
        group
    ]);

}