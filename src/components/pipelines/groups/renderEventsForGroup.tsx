"use client";
import { LinearIndeterminate } from "../../ui/feedback";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import EventsLayout from "../../sections/events/eventsLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export const RenderEventsForGroup = () => {
    const events = useSelector((s: RootState) => s.openGroup.events);
    const page = useSelector((s: RootState) => s.openGroup.currPage);


    if ((events.status === "pending") || (events.status === "refreshing")) {

        return (<LinearIndeterminate />)
    }

    if (events.status === "ready") {
        return (
            <EventsLayout eventsPages={events.data} currentPage={page} />
        )
    }


    if (events.status === "warning") {
        return (
            <NoScheduledEvents />
        )
    }
}