"use client";
import type { DomainStatus } from "@/src/lib/types/tokens/types";
import { NoEventsFound } from "../../ui/box/fallbacks/noEventsFound";
import EventsLayout from "@/src/client/components/sections/events/eventsLayout";
import { JSX } from "react";
import type { EventsPages } from "@/src/lib/store/slices/events/types";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";

const LoadEventsPipeline = (
    eventLoadingStatus: DomainStatus,
    eventsPages: EventsPages
): JSX.Element | null => {
    const currentPage = useSelector((s: RootState) => s.events.currentPage);

    switch (eventLoadingStatus) {
        case "pending":
            return (
                <RelativeSpinner key={"pending-spinner"} />
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
                <NoEventsFound
                    key={"default-fallback"}
                />

            )
        }
    }
};

export { LoadEventsPipeline };