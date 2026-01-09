"use client"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import type { AppDispatch, RootState } from "@/src/lib/store/root/store";
import { getEvents } from "@/src/lib/store/slices/EventCategorySlice";
import type { EventLoadingStatus, UsePopulateEventsListHook } from "../types/types";
import { trpcClient } from "@/src/trpc/trpcClient";

const usePopulateEventsList = (): UsePopulateEventsListHook => {
    const events = useSelector((s: RootState) => s.categories.events);
    const [eventStatus, setEventStatus] = useState<EventLoadingStatus>('pending');
    const timerRef = useRef<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const loadedRef = useRef<boolean | null>(null);

    useEffect(() => {
        if (events.length > 0) return;
        if (loadedRef.current) return;
        loadedRef.current = true

        const loadEvents = async (): Promise<void> => {
            try {
                const res = await trpcClient.events.list.mutate();
                //const grps = await trpcClient.groups.list.mutate();
                //console.log(grps);

                if (!res.items) {
                    setEventStatus("failed")
                    throw new Error("Failed to fetch")
                }

                const { items } = res;

                dispatch(getEvents(items));

                timerRef.current = window.setTimeout(() => {
                    setEventStatus((items.length > 0) ? "idle" : "failed")
                    timerRef.current = null;
                }, 1200);
            } catch (err) {
                console.error("tRPC request failed before reaching the server", err)
            }
        };

        loadEvents();

        return () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
        }
    }, []);

    return {
        eventLoadingStatus: eventStatus
    }
};

export { usePopulateEventsList }