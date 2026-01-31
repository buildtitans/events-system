"use client";
import type { LoadingStatus } from "@/src/lib/types/tokens/types";
import { LinearIndeterminate } from "@/src/components/ui/feedback/"
import { NoEventsFound } from "../../ui/box/noEventsFound";
import EventsLayout from "@/src/components/sections/events/eventsLayout";
import { JSX } from "react";

const loadEventsPipeline = (eventLoadingStatus: LoadingStatus): JSX.Element => {

    switch (eventLoadingStatus) {
        case "pending":
            return (
                <LinearIndeterminate />
            )
        case "idle":
            return <EventsLayout />

        case "failed":
            return <NoEventsFound />

        default: {
            return (
                <LinearIndeterminate />
            )
        }
    }
};

export { loadEventsPipeline };