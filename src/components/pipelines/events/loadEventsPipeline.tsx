"use client";
import type { LoadingStatus } from "@/src/lib/types/types";
import { LinearIndeterminate } from "@/src/components/ui/feedback/"
import { NoEventsFound } from "../../ui/box/noEventsFound";
import EventCards from "../../ui/stack/eventCards";
import { JSX } from "react";

const loadEventsPipeline = (eventLoadingStatus: LoadingStatus): JSX.Element => {

    switch (eventLoadingStatus) {
        case "pending":
            return (
                <LinearIndeterminate />
            )
        case "idle":
            return <EventCards
            />

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