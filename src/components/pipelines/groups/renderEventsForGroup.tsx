"use client";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import EventsLayout from "../../sections/events/eventsLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import React, { JSX } from "react";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";

export const RenderEventsForGroup = (): JSX.Element => {
  const events = useSelector((s: RootState) => s.openGroup.events);
  const page = useSelector((s: RootState) => s.openGroup.currPage);


  switch (events.status) {
    case "pending": {
      return <RelativeSpinner />;
    }

    case "ready": {
        
      return (
        <React.Fragment>
        <EventsLayout eventsPages={events.data} currentPage={page} />
      </React.Fragment>
      )
    }

    case "warning":{
        return <NoScheduledEvents />
    }

    default: {
      return <RelativeSpinner />;
    }
  }
};