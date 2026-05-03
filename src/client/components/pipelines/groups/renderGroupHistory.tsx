"use client";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useHydrateGroupHisory } from "@/src/lib/hooks/hydration/useHydrateGroupHistory";
import Spinner, {
  RelativeSpinner,
} from "@/src/client/components/ui/feedback/pending/spinner";
import HistoryTimeline from "../../sections/group/openedGroup/displays/groupHistory";
import NoGroupHistory from "../../ui/feedback/fallbacks/noGroupHIstory";
import OpenedGroupFallback from "../../ui/feedback/fallbacks/groupFallback";

type RenderGroupHistoryProps = {
  isMobile: boolean;
};

export default function RenderGroupHistory({
  isMobile,
}: RenderGroupHistoryProps): JSX.Element {
  useHydrateGroupHisory();
  const history = useSelector((s: RootState) => s.openGroup.history);

  switch (history.status) {
    case "initial":
    case "pending": {
      return <RelativeSpinner />;
    }
    case "ready": {
      return <HistoryTimeline isMobile={isMobile} history={history.data} />;
    }
    case "failed": {
      return <OpenedGroupFallback 
      eyeBrow={"History"}
      fallbackTitle={"No events held yet"}
      fallbackDescripton={"This group has not hosted any completed events yet, so there is no activity history to show here."}
      fallbackCaption={"If you want to get in touch with the organizer, their email is listed above."}
      />;
    }

    default: {
      <NoGroupHistory />;
    }
  }

  return <Spinner />;
}
