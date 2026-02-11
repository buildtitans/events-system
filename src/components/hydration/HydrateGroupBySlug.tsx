"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { getGroupEvents, groupOpened } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect } from "react";
import { syncOpenedGroup } from "@/src/lib/store/sync/syncOpenedGroup";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";
import { useRefreshGroupEvents } from "@/src/lib/hooks/hydration/useRefreshGroupEvents";
import { wait } from "@/src/lib/utils/helpers/wait";

export default function HydrateGroupBySlug({ slug }: { slug: string }): React.ReactNode {
    const dispatch = useDispatch<AppDispatch>();
    useRefreshGroupEvents();

    const handleSyncGroupOpened = (group: GroupSchemaType) => {
        dispatch(groupOpened({
            status: "ready",
            data: group
        }));
    }

    const handleSyncEventsOfGroup = (events: EventsPages) => {
        if (events.length > 0) {
            dispatch(getGroupEvents({
                status: "ready",
                data: events
            }));
            return;
        };
        dispatch(getGroupEvents({
            status: "warning",
            message: "No events have been scheduled for this group"
        }));
    };

    useEffect(() => {
        const handlePayload = async (
            group: GroupSchemaType,
            events: EventsPages
        ): Promise<void> => {
            await wait(500);
            handleSyncGroupOpened(group);
            await wait(1200);
            handleSyncEventsOfGroup(events);
        }

        const executeHydration = async () => {
            dispatch(groupOpened({ status: "pending" }))
            dispatch(getGroupEvents({ status: "pending" }))

            const {
                events,
                group
            } = await syncOpenedGroup(slug);

            await handlePayload(group, events);

        }
        void executeHydration();



    }, [slug, dispatch]);

    return null;
}