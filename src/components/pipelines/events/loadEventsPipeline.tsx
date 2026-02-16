"use client";
import type { DomainStatus } from "@/src/lib/types/tokens/types";
import { LinearIndeterminate } from "@/src/components/ui/feedback/"
import { NoEventsFound } from "../../ui/box/fallbacks/noEventsFound";
import EventsLayout from "@/src/components/sections/events/eventsLayout";
import { JSX } from "react";
import { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

const loadEventsPipeline = (eventLoadingStatus: DomainStatus, eventsPages: EventsPages): JSX.Element | null => {
    const currentPage = useSelector((s: RootState) => s.events.currentPage);

    switch (eventLoadingStatus) {
        case "pending":
            return (
                <LinearIndeterminate
                    key={"linearLoader"}
                />
            )
        case "idle":
            return (<EventsLayout
                key={"events-layout"}
                eventsPages={eventsPages}
                currentPage={currentPage}
            />)

        case "failed":
            return <NoEventsFound
                key={"could-not-fetch-events"}
            />

        case "warning":
            return (
                <NoScheduledEvents
                    key={"no-scheduled-events"}
                />
            )

        default: {
            return (
                <LinearIndeterminate
                    key={"linearLoader"}
                />
            )
        }
    }
};

export { loadEventsPipeline };