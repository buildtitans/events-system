import type { PariticpationsState } from "@/src/lib/store/slices/user/types";
import MyRsvps from "../../sections/user/myRsvps";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";
import { JSX } from "react";
import FadeIn from "../../ui/box/motionboxes/fadeIn";

type RenderRsvpsProps = { participations: PariticpationsState };

export default function RenderRsvps({
  participations,
}: RenderRsvpsProps): JSX.Element {
  switch (participations.status) {
    case "pending": {
      return (
        <FadeIn keyValue={"pending-fade-wrapper"}>
            <SimpleBackdrop />;
        </FadeIn>
      )
    }
    case "ready": {
      return (
        <FadeIn keyValue={"ready-fade-wrapper"}>
            <MyRsvps rsvps={participations.data.rsvps} />
        </FadeIn>
      );
    }

    case "failed": {
      return (
        <FadeIn keyValue={"failed-fallback-fade-wrapper"}>
            <AsyncFailedFallback error={participations.error} />
        </FadeIn>
      )
    }
    case "n/a": {
      return (
        <FadeIn  keyValue={"rsvps-na-fallback-fade-wrapper"}>
            <AsyncFailedFallback message={participations.message} />
        </FadeIn>
      )
    }

    default: {
      return (
         <FadeIn  keyValue={"default-rsvps-fade-wrapper"}>
            <SimpleBackdrop />;
        </FadeIn>
      )
    }
  }
}
