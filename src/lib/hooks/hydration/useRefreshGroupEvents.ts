"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { getGroupEvents } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect } from "react";
import { wait } from "@/src/lib/utils/helpers/wait";
import { syncEventsForGroup } from "@/src/lib/store/sync/syncEvents";


export const useRefreshGroupEvents = () => {
    const groupEvents = useSelector((s: RootState) => s.openGroup.events);
    const dispatch = useDispatch<AppDispatch>();
    const group = useSelector((s: RootState) => s.openGroup.group);


    useEffect(() => {
        if (group.status !== "ready" || (groupEvents.status !== "refreshing")) return;

        const executeGroupEventsRefresh = async () => {
            await wait(300);

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
        dispatch,
        group,
        groupEvents.status,

    ]);

}