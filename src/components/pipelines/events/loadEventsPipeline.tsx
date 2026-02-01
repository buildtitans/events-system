"use client";
import type { LoadingStatus } from "@/src/lib/types/tokens/types";
import { LinearIndeterminate } from "@/src/components/ui/feedback/"
import { NoEventsFound } from "../../ui/box/noEventsFound";
import EventsLayout from "@/src/components/sections/events/eventsLayout";
import { JSX } from "react";
import { EventsPages } from "@/src/lib/store/slices/EventsSlice";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";

const loadEventsPipeline = (eventLoadingStatus: LoadingStatus, eventsPages: EventsPages): JSX.Element => {


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
                    key={"default-fallback"}
                />
            )
        }
    }
};

export { loadEventsPipeline };