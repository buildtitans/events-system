"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { getGroupEvents, groupOpened, groupEventsStatus } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect, useRef } from "react";
import { syncOpenedGroup } from "@/src/lib/store/sync/syncOpenedGroup";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";


export default function HydrateGroupBySlug({ slug }: { slug: string }): React.ReactNode {
    const dispatch = useDispatch<AppDispatch>();
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const handleSync = (
            group: GroupSchemaType,
            events: EventsPages
        ): void => {

            dispatch(getGroupEvents({ status: "ready", data: events }));
            if (events.length === 0) {
                dispatch(groupEventsStatus("warning"))
            } else {
                dispatch(groupEventsStatus("idle"));
            }

            timerRef.current = window.setTimeout(() => {
                dispatch(groupOpened({ status: "ready", data: group }));
            }, 1200)

        };

        const executeHydration = async () => {
            dispatch(groupOpened({ status: "pending" }))
            dispatch(groupEventsStatus("pending"));
            dispatch(getGroupEvents({ status: "pending" }))

            const {
                events,
                group
            } = await syncOpenedGroup(slug);

            handleSync(group, events);
        }
        void executeHydration();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }

    }, [slug, dispatch])

    return null;
}