"use client";
import { NoEventsFound } from "../../ui/box/fallbacks/noEventsFound";
import EventsLayout from "@/src/components/sections/events/eventsLayout";
import { JSX } from "react";
import { EventsDomainType } from "@/src/lib/store/slices/events/types";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";

export const EventsPipeline = (events: EventsDomainType): JSX.Element => {
    const currentPage = useSelector((s: RootState) => s.events.currentPage);
    const groupNameLookup = useSelector((s: RootState) => s.groups.groupNameLookup);

    console.log({
        "Dictionary": groupNameLookup
    })

    switch (events.status) {
        case "pending":
            return (
                <RelativeSpinner
                    key={"pending-spinner"}
                />
            )
        case "ready":
            return (<EventsLayout
                key={"events-layout"}
                eventsPages={events.data}
                currentPage={currentPage}
            />)

        case "failed":
            return (
                <NoEventsFound
                    key={"could-not-fetch-events"}
                />
            )

        case "n/a":
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
}