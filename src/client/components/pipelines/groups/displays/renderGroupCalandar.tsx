"use client";
import type { JSX } from "react";
import type { FlattenedGroupEventsState } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import Calandar from "../../../ui/dates/calandar";
import { RelativeSpinner } from "../../../ui/feedback/pending/spinner";
import FadeIn from "../../../ui/box/motionboxes/fadeIn";
import AsyncFailedFallback from "../../../ui/feedback/failure/asyncFailedFallback";
import OpenedGroupFallback from "../../../ui/feedback/fallbacks/groupFallback";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type RenderGroupCalandarProps = {
  flattenedGroupEvents: FlattenedGroupEventsState;
};

export const RenderGroupCalandar = ({
  flattenedGroupEvents,
}: RenderGroupCalandarProps): JSX.Element => {
  switch (flattenedGroupEvents.status) {
    case "ready": {
      return (
        <FadeIn keyValue="calandar-fadein">
          <Calandar history={flattenedGroupEvents.data} />
        </FadeIn>
      );
    }
    case "failed": {
      return (
        <FadeIn keyValue="failed-fadein">
          <AsyncFailedFallback />
        </FadeIn>
      );
    }
    case "n/a": {
      return (
        <FadeIn keyValue="n/a-fade-in">
          <OpenedGroupFallback
            eyeBrow="Overview"
            fallbackTitle="No events have been scheduled"
            fallbackDescripton="This group has not scheduled any events yet, so there are no events to RSVP to right now."
            fallbackCaption="If you want to get in touch with the organizer, their email is listed above."
          />
        </FadeIn>
      );
    }

    case "initial":
    case "pending": {
      return (
        <FadeIn keyValue="pending-fadein">
          <RelativeSpinner />
        </FadeIn>
      );
    }

    default: {
      return assertNever(flattenedGroupEvents);
    }
  }
};
