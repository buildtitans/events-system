"use client"
import { useEffect, useRef, useState } from "react";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { LoadingStatus, RequestStatus } from "../../types/tokens/types";
import { GetGroupEventsHook } from "../../types/hooks/types";
import { EventsPages } from "../../store/slices/EventsSlice";

export const useGetGroupEvents = (group_id: EventSchemaType["group_id"] | null | undefined): GetGroupEventsHook => {
    const [status, setStatus] = useState<LoadingStatus>('idle');
    const [groupEvents, setGroupEvents] = useState<EventsPages>([]);
    const timerRef = useRef<number | null>(null);

    function handleResult(result: EventsPages) {
        if (timerRef.current !== null) clearTimeout(timerRef.current);

        timerRef.current = window.setTimeout(() => {
            setGroupEvents(result);
            setStatus((result.length < 1 ? "warning" : "idle"));
        }, 1200);
    };

    useEffect(() => {
        if (!group_id) return;

        const executeGetGroupEvents = async () => {
            setStatus('pending');
            try {
                const result = await trpcClient.events.groupEvents.mutate(group_id) ?? [];
                handleResult(result);
            } catch (err) {
                setStatus('failed');
                console.error(err);
            }

        };

        void executeGetGroupEvents();

        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        }

    }, [group_id]);


    return {
        groupEvents,
        status
    };
}