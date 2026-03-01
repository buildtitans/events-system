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
import {
    EventsPages,
    PresentedCategory
} from "../../store/slices/events/types";
import { wait } from "@/src/lib/utils/rendering/wait";
import { trpcClient } from "@/src/trpc/trpcClient";
import type {
    ChangeActiveCategoryHook,
    FilterType
} from "../../types/hooks/types";
import {
    curateUpcomingEventIds,
    UpcomingEventIds
} from "../../utils/dates/curateUpcomingEventIds";
import { PopularEventsIds } from "@/src/server/src/lib/utils/curatePopularEventsIds";

export const useChangeActiveCategory = (): ChangeActiveCategoryHook => {
    const hydrateStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);
    const status = useSelector((s: RootState) => s.events.eventPages.status);
    const [filter, setFilter] = useState<FilterType>("initial");
    const dispatch = useDispatch<AppDispatch>();



    const getUpcomingEvents = async (
        ids: UpcomingEventIds,
    ) => {
        const upcomingEvents = await trpcClient
            .events
            .eventsById
            .mutate(ids);

        dispatch(populateEvents({
            status: "ready",
            data: upcomingEvents
        }));
    };

    const executeGetUpcomingEvents = async (
        filter: Extract<FilterType, PresentedCategory>
    ): Promise<void> => {
        const eventsPages = await trpcClient
            .events
            .list
            .mutate();

        const ids = curateUpcomingEventIds(eventsPages);

        if (ids.length === 0) {
            dispatch(populateEvents({
                status: "failed",
                error: "Couldn't find any events for that filter"
            }));
            return;
        }
        await getUpcomingEvents(ids);
    };

    const getAllActiveEvents = async (
        filter: Extract<FilterType, PresentedCategory>
    ): Promise<void> => {

        dispatch(selectCategory(filter));
        const allActiveEvents = await trpcClient
            .events
            .list
            .mutate();

        dispatch(populateEvents({
            status: 'ready',
            data: allActiveEvents
        }));
    };

    const compilePopularEventIds = async (): Promise<PopularEventsIds> => {
        return await trpcClient
            .eventAttendants
            .getPopularEventIds
            .mutate();
    };

    const retrievePopularEvents = async (
        ids: PopularEventsIds
    ): Promise<EventsPages> => {
        const events = await trpcClient
            .events
            .eventsById
            .mutate(ids);

        return events
    };

    const getPopularEvents = async (

    ) => {
        const ids = await compilePopularEventIds();
        const popularEvents = await retrievePopularEvents(ids);
        dispatch(populateEvents({
            status: "ready",
            data: popularEvents
        }));
    };

    console.log({ "Events Status": status })


    useEffect(() => {
        if (hydrateStatus !== "idle") return;
        if (filter === "initial") return;

        const executeFilterEvents = async (
            filter: FilterType
        ) => {
            dispatch(populateEvents({ status: "pending" }));

            await wait(3000);

            switch (filter) {
                case "All Events":
                    await getAllActiveEvents(filter);
                    dispatch(selectCategory(filter));

                    setFilter("initial")
                    return;
                case "Popular Events":
                    await getPopularEvents();
                    dispatch(selectCategory(filter));
                    setFilter("initial")
                    return;

                case "Upcoming events":
                    await executeGetUpcomingEvents(filter);
                    dispatch(selectCategory(filter));

                    setFilter("initial")
                    return

                case "initial": {
                    return
                }
                default: {
                    return;
                }
            };
        };

        void executeFilterEvents(filter);
    }, [
        hydrateStatus,
        filter,
        dispatch
    ]);

    return {
        setFilter,
        eventStatus: status,
        mountStatus: hydrateStatus,
        pendingFilter: (status === "pending")
    };
};