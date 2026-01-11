"use client"
import { trpcClient } from "@/src/trpc/trpcClient";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    useEffect,
    useRef,
    useState
} from "react";
import type {
    AppDispatch,
    RootState
} from "@/src/lib/store/root/store";
import type {
    LoadingStatus,
    UsePopulateEventsListHook
} from "../types/types";
import { chunkEventPages } from "@/src/lib/store/slices/EventCategorySlice";

const usePopulateEventsList = (): UsePopulateEventsListHook => {
    const eventsPages = useSelector((s: RootState) => s.events.eventPages)
    const [eventStatus, setEventStatus] = useState<LoadingStatus>('pending');
    const dispatch = useDispatch<AppDispatch>();
    const loadedRef = useRef<boolean | null>(null);

    useEffect(() => {
        const events_stored = eventsPages;
        if ((loadedRef.current) || (events_stored.length > 0)) return;

        loadedRef.current = true

        const loadEvents = async (): Promise<void> => {
            try {
                const eventsRes = await trpcClient.events.list.mutate();
                const rawEvents = eventsRes.items;

                dispatch(chunkEventPages(rawEvents));
                setEventStatus((rawEvents.length > 0) ? "idle" : "failed")

            } catch (err) {
                console.error("tRPC request failed before reaching the server", err)
                setEventStatus("failed");
            }
        };
        loadEvents();
    }, [eventsPages.length, dispatch]);

    return {
        eventLoadingStatus: eventStatus
    }
};

export { usePopulateEventsList }