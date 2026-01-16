"use client"
import { trpcClient } from "@/src/trpc/trpcClient";
import { TRPCClientError } from "@trpc/client";
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
    const [eventStatus, setEventStatus] = useState<LoadingStatus>('idle');
    const dispatch = useDispatch<AppDispatch>();
    const loadedRef = useRef<boolean | null>(null);

    useEffect(() => {
        const events_stored = eventsPages;
        if ((loadedRef.current) || (events_stored.length > 0)) return;

        loadedRef.current = true

        const loadEvents = async (): Promise<void> => {
            setEventStatus("pending");

            try {
                const eventsRes = await trpcClient.events.list.mutate()
                const rawEvents = eventsRes.items;

                dispatch(chunkEventPages(rawEvents));
                setEventStatus((rawEvents.length > 0) ? "idle" : "failed")

            } catch (err) {
                if (err instanceof TRPCClientError) {
                    console.error("tRPC error", {
                        message: err.message,
                        code: err.data?.code,
                        httpStatus: err.data?.httpStatus,
                        path: err.data?.path,
                        cause: err.cause,
                        shape: err.shape,
                        stack: err.data?.stack
                    });
                } else {
                    console.error("Unknown error", err);
                }

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