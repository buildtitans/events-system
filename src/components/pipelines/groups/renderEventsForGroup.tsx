"use client";
import type { HydratedEventsForOpenedGroup } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { LinearIndeterminate } from "../../ui/feedback";
import { NoEventsFound } from "../../ui/box/fallbacks/noEventsFound";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import GroupEventsLayout from "../../sections/events/groupEventsLayout";
import EventsLayout from "../../sections/events/eventsLayout";

type RenderEventsForGroupProps = {
    events: HydratedEventsForOpenedGroup
}

export const RenderEventsForGroup = ({
    events
}: RenderEventsForGroupProps) => {

    switch (events.status) {
        case "refreshing":
        case "pending":
            return (
                <LinearIndeterminate />
            )
        case "warning":
            return (
                <NoScheduledEvents />
            )
        case "ready":
            return (
                <EventsLayout eventsPages={events.data} />
            )

        case "failed":
            return (
                <NoEventsFound />
            )
    }
}