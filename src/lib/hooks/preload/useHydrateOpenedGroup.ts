"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
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
    const { group, events } = useSelector((s: RootState) => s.openGroup);

    function handleTrpcResponses(
        events: EventsPages | null | undefined,
        group: GroupSchemaType | null | undefined,
    ) {

        if (events) {
            dispatch(getGroupEvents(events));
        };

        if (group) {
            dispatch(groupOpened(group));
        }

        return "finished";
    };

    useEffect(() => {
        if (!slug) return;

        const executeGetGroupBySlug = async () => {
            setStatus("pending");
            try {
                const group = await trpcClient.groups.groupBySlug.mutate(slug);
                const events = await trpcClient.events.groupEvents.mutate(group.id);


                const dispatches = handleTrpcResponses(
                    events,
                    group,
                );

                if (dispatches === "finished" && (group)) {
                    timerRef.current = window.setTimeout(() => {
                        setStatus("idle");
                        timerRef.current = null;
                    }, 1200)
                }


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