"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import {
    useDispatch,
    useSelector
} from "react-redux";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { PresentedCategory } from "../../store/slices/events/types";
import { AppDispatch, RootState } from "../../store";
import { populateEvents, selectCategory } from "../../store/slices/events/EventsSlice";
import { wait } from "../../utils/rendering/wait";

type FilterEventsHook = {
    setFilter: React.Dispatch<SetStateAction<PresentedCategory | null>>,
}

export const useFilterEvents = (): FilterEventsHook => {
    const hydrateStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);
    const displayed = useSelector((s: RootState) => s.events.displayed);
    const [filter, setFilter] = useState<PresentedCategory | null>(null);
    const prevFilterRef = useRef<PresentedCategory>("All Events");
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if (!filter) return;
        if (hydrateStatus !== "idle") return;
        if (prevFilterRef.current === filter) return;

        const getAllActiveEvents = async (): Promise<void> => {
            const allActiveEvents = await trpcClient.events.list.mutate();
            dispatch(populateEvents({ status: 'ready', data: allActiveEvents, filter: filter }));
            prevFilterRef.current = filter;
            dispatch(selectCategory(filter));
            setFilter(null);
        };

        const getPopularEvents = async () => {
            const ids = await trpcClient
                .eventAttendants
                .getPopularEventIds
                .mutate();

            const popularEvents = await trpcClient
                .events
                .filterPopularEvents
                .mutate(ids);

            dispatch(populateEvents({ status: "ready", data: popularEvents, filter: filter }));
            prevFilterRef.current = filter;
            dispatch(selectCategory(filter));
            setFilter(null);

        }

        const executeFilterEvents = async () => {
            dispatch(populateEvents({ status: "pending", filter: filter }));

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
            }
        };

        void executeFilterEvents();

    }, [
        hydrateStatus,
        filter,
        dispatch
    ]);


    return { setFilter };
};