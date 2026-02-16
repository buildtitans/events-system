"use client";
import { LinearIndeterminate } from "../../ui/feedback";
import { NoEventsFound } from "../../ui/box/fallbacks/noEventsFound";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import EventsLayout from "../../sections/events/eventsLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";


export const RenderEventsForGroup = () => {
    const events = useSelector((s: RootState) => s.openGroup.events);


    if ((events.status === "pending") || (events.status === "refreshing")) {

        return (<LinearIndeterminate />)
    }

    if (events.status === "ready") {
        return (
            <EventsLayout eventsPages={events.data} />
        )
    }


    if (events.status === "warning") {
        return (
            <NoScheduledEvents />
        )
    }
}