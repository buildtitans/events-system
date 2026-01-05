import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import type { AppDispatch, RootState } from "@/src/store";
import { getEvents } from "@/src/store/slices/EventCategorySlice";
import { trpcClient } from "../trpc/trpcClient";

export type EventLoadingStatus = 'idle' | 'pending'

type UsePopulateEventsListType = {
    eventLoadingStatus: EventLoadingStatus
}

const usePopulateEventsList = (): UsePopulateEventsListType => {
    const events = useSelector((s: RootState) => s.categories.events);
    const [eventStatus, setEventStatus] = useState<EventLoadingStatus>('pending');
    const timerRef = useRef<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (events.length > 0) return;

        const loadEvents = async (): Promise<void> => {
            const results = await trpcClient.events.list.query({
                page: 1,
                limit: 10
            });
            dispatch(getEvents(results.items));

            timerRef.current = window.setTimeout(() => {
                setEventStatus('idle')
                timerRef.current = null;
            }, 3000);

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