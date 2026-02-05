"use client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect, useRef, useState } from "react";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { EventsPages } from "../../store/slices/EventsSlice";
import { groupOpened } from "../../store/slices/groups/OpenedGroupSlice";
import { LoadingStatus } from "../../types/tokens/types";
import { getGroupEvents } from "../../store/slices/groups/OpenedGroupSlice";


export const useHydrateOpenedGroup = (slug: GroupSchemaType["slug"]): { status: LoadingStatus } => {
    const [status, setStatus] = useState<LoadingStatus>("idle");
    const dispatch = useDispatch<AppDispatch>();
    const timerRef = useRef<number | null>(null);

    async function handleTrpcResponses(
        events: EventsPages | null | undefined,
        group: GroupSchemaType | null | undefined,
    ) {

        if (events) {
            dispatch(getGroupEvents(events));
        };

        if (group) {
            dispatch(groupOpened(group));
        }
    };

    useEffect(() => {
        if (!slug) return;

        const executeGetGroupBySlug = async () => {
            setStatus("pending");
            try {
                const group = await trpcClient.groups.groupBySlug.mutate(slug);
                const events = await trpcClient.events.groupEvents.mutate(group.id);


                await handleTrpcResponses(
                    events,
                    group,
                );

                timerRef.current = window.setTimeout(() => {
                    setStatus("idle");
                    timerRef.current = null;
                }, 1200)


            } catch (err) {
                console.error(err);
                setStatus("failed");
            }


        }

        void executeGetGroupBySlug();


        return () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
        }

    }, [slug]);

    return { status }
}