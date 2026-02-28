"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    AppDispatch,
    RootState
} from "@/src/lib/store";
import {
    populateEvents,
    selectCategory
} from "@/src/lib/store/slices/events/EventsSlice";
import { PresentedCategory } from "../../store/slices/events/types";
import { wait } from "@/src/lib/utils/rendering/wait";
import { trpcClient } from "@/src/trpc/trpcClient";
import type { ChangeActiveCategoryHook } from "../../types/hooks/types";


export const useChangeActiveCategory = (): ChangeActiveCategoryHook => {
    const hydrateStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);
    const status = useSelector((s: RootState) => s.events.eventPages.status);
    const [filter, setFilter] = useState<PresentedCategory | null>(null);
    const prevFilterRef = useRef<PresentedCategory | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (status === "pending" || status === "initial") return;
        if (!filter) return;
        if (hydrateStatus !== "idle") return;
        if (prevFilterRef.current === filter) return;

        const getAllActiveEvents = async (): Promise<void> => {

            dispatch(selectCategory(filter));
            const allActiveEvents = await trpcClient
                .events
                .list
                .mutate();

            dispatch(populateEvents({
                status: 'ready',
                data: allActiveEvents
            }));
            prevFilterRef.current = filter;
            setFilter(null);
        };

        const getPopularEvents = async () => {
            dispatch(selectCategory(filter));
            const ids = await trpcClient
                .eventAttendants
                .getPopularEventIds
                .mutate();

            const popularEvents = await trpcClient
                .events
                .filterPopularEvents
                .mutate(ids);

            dispatch(populateEvents({ status: "ready", data: popularEvents }));
            prevFilterRef.current = filter;
            setFilter(null);

        }

        const executeFilterEvents = async () => {
            dispatch(populateEvents({ status: "pending" }));

            await wait(1200);

            switch (filter) {
                case "All Events":
                    await getAllActiveEvents();
                    return;
                case "Popular Events":
                    await getPopularEvents();
                    return;
                default: {
                    return;
                }
            };
        };

        void executeFilterEvents();

    }, [
        status,
        hydrateStatus,
        filter,
        dispatch
    ]);


    return {
        setFilter,
        eventStatus: status,
        mountStatus: hydrateStatus
    };
};