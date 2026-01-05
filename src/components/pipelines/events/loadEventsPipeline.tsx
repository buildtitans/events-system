import type { EventLoadingStatus } from "@/src/lib/hooks/usePopulateEventLIst"
import LinearIndeterminate from "@/src/components/ui/feedback/linearLoader";
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

        default: {
            return (
                <LinearIndeterminate />
            )
        }
    }
};

export { loadEventsPipeline };