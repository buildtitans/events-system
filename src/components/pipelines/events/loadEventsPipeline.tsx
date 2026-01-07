import type { EventLoadingStatus } from "@/src/lib/types/types";
import { LinearIndeterminate } from "@/src/components/ui/feedback/"
import { NoEventsFound } from "../../layout/box/noEventsFound";
import EventCards from "../../layout/stack/eventCards";
import { JSX } from "react";

const loadEventsPipeline = (eventLoadingStatus: EventLoadingStatus): JSX.Element => {

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