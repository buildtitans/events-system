import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import type { AppDispatch, RootState } from "@/src/lib/store/root/store";
import { getEvents } from "@/src/lib/store/slices/EventCategorySlice";
import { trpcClient } from "../trpc/trpcClient";
import type { EventLoadingStatus, UsePopulateEventsListHook } from "../types/types";


const usePopulateEventsList = (): UsePopulateEventsListHook => {
    const events = useSelector((s: RootState) => s.categories.events);
    const [eventStatus, setEventStatus] = useState<EventLoadingStatus>('pending');
    const timerRef = useRef<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (events.length > 0) return;

        const loadEvents = async (): Promise<void> => {
            await trpcClient.events.seed.mutate()
            const events = await trpcClient.events.list.query();
            dispatch(getEvents(events.items));

            timerRef.current = window.setTimeout(() => {
                setEventStatus('idle')
                timerRef.current = null;
            }, 1500);

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