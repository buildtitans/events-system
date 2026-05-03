"use client";
import EventsLayout from "../../sections/events/eventsLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import React, { JSX } from "react";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";
import OpenedGroupFallback from "../../ui/feedback/fallbacks/groupFallback";

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
        return <OpenedGroupFallback 
          eyeBrow={"Events"}
          fallbackTitle={"No events have been scheduled"}
          fallbackDescripton={"This group has not scheduled any events yet, so there are no events to RSVP to right now."}
          fallbackCaption={"If you want to get in touch with the organizer, their email is listed above."}
          />
    }

    default: {
      return <RelativeSpinner />;
    }
  }
};