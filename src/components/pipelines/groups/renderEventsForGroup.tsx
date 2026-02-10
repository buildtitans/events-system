"use client";
import type { HydratedEventsForOpenedGroup } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import EventsLayout from "../../sections/events/eventsLayout";
import { LinearIndeterminate } from "../../ui/feedback";
import { NoEventsFound } from "../../ui/box/fallbacks/noEventsFound";

type RenderEventsForGroupProps = {
    events: HydratedEventsForOpenedGroup
}

export const RenderEventsForGroup = ({
    events
}: RenderEventsForGroupProps) => {

    switch (events.status) {
        case "pending":
            return (
                <LinearIndeterminate />
            )
        case "failed":
            return (
                <NoEventsFound />
            )
        case "ready":
            return (
                <EventsLayout eventsPages={events.data} />
            )

        default: {
            return null;
        }
    }
}