"use client";
import { NoEventsFound } from "../../ui/box/fallbacks/noEventsFound";
import EventsLayout from "@/src/components/sections/events/eventsLayout";
import { JSX } from "react";
import { EventsStateType } from "@/src/lib/store/slices/events/types";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";

export const EventsPipeline = (events: EventsStateType): JSX.Element => {
  const currentPage = useSelector((s: RootState) => s.events.currentPage);

  switch (events.status) {
    case "initial":
    case "pending":
      return <RelativeSpinner />;
    case "ready":
      return (
        <EventsLayout
          key={"events-layout"}
          eventsPages={events.data}
          currentPage={currentPage}
        />
      );

    case "failed":
      return <AsyncFailedFallback message={events.error} />;

    case "n/a":
      return <NoScheduledEvents key={"no-scheduled-events"} />;

    default: {
      return <NoEventsFound key={"default-fallback"} />;
    }
  }
};
