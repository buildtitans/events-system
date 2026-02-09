"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { getGroupEvents, groupOpened, groupEventsStatus } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect } from "react";
import { syncOpenedGroup } from "@/src/lib/store/sync/syncOpenedGroup";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";


export default function HydrateGroupBySlug({ slug }: { slug: string }): React.ReactNode {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleSync = (
            group: GroupSchemaType,
            events: EventsPages
        ): void => {

            dispatch(groupOpened({ status: "ready", data: group }));
            dispatch(getGroupEvents(events));
            if (events.length === 0) {
                dispatch(groupEventsStatus("warning"))
            } else {
                dispatch(groupEventsStatus("idle"));
            }
        };


        const executeHydration = async () => {
            dispatch(groupEventsStatus("pending"));

            const {
                events,
                group
            } = await syncOpenedGroup(slug)

            handleSync(group, events);
        }

        void executeHydration();

    }, [slug, dispatch])

    return null;
}