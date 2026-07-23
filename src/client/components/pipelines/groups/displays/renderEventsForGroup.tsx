"use client";
import EventsLayout from "@/src/client/components/sections/events/eventsLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import React, { JSX } from "react";
import Spinner from "@/src/client/components/ui/feedback/pending/spinner";
import OpenedGroupFallback from "@/src/client/components/ui/feedback/fallbacks/widgets/groupFallback";
import FadeIn from "@/src/client/components/ui/box/motionboxes/fadeIn";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

export const RenderEventsForGroup = (): JSX.Element => {
  const events = useSelector((s: RootState) => s.openGroup.events);
  const page = useSelector((s: RootState) => s.openGroup.currPage);
  switch (events.status) {
    case "ready": {
      return (
        <React.Fragment>
          <EventsLayout eventsPages={events.data} currentPage={page} />
        </React.Fragment>
      );
    }

    case "n/a": {
      return <OpenedGroupFallback />;
    }

    case "failed": {
      return (
        <FadeIn keyValue="failed-key">
          <AsyncFailedFallback
            title="Error"
            message="An issue occured fetching events for this group"
          />
        </FadeIn>
      );
    }
    case "initial":
    case "refreshing":
    case "pending": {
      return <Spinner />;
    }

    default: {
      return assertNever(events);
    }
  }
};
