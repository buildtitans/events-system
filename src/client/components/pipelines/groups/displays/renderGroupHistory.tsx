"use client";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useHydrateGroupHisory } from "@/src/lib/hooks/hydration/group/useHydrateGroupHistory";
import Spinner, {
  RelativeSpinner,
} from "@/src/client/components/ui/feedback/pending/spinner";
import HistoryTimeline from "../../../sections/group/openedGroup/displays/groupHistory";
import NoGroupHistory from "../../../ui/feedback/fallbacks/noGroupHIstory";
import OpenedGroupFallback from "../../../ui/feedback/fallbacks/groupFallback";
import { OpenedGroupSection } from "@/src/lib/store/slices/groups/types";

type RenderGroupHistoryProps = {
  isMobile: boolean;
  displayed: OpenedGroupSection
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
      />;
    }
    default: {
      <NoGroupHistory />;
    }
  }

  return <Spinner />;
}
