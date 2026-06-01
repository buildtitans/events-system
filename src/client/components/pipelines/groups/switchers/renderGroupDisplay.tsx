"use client";
import { RenderEventsForGroup } from "../displays/renderEventsForGroup";
import { JSX } from "react";
import RenderGroupHistory from "../displays/renderGroupHistory";
import GroupCalandar from "@/src/client/features/group/groupCalandar";
import type { OpenedGroupSection } from "@/src/lib/store/slices/groups/types";
import FadeIn from "../../../ui/box/motionboxes/fadeIn";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { AsyncStateRenderer } from "../../asyncRenderer";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import OpenedGroupFallback from "../../../ui/feedback/fallbacks/groupFallback";
import Archives from "../../../sections/group/openedGroup/displays/archives";

type RenderGroupDisplayProps = {
  view: OpenedGroupSection;
  isMobile: boolean;
};

export function RenderGroupDisplay({
  view,
  isMobile,
}: RenderGroupDisplayProps): JSX.Element {
  const archives = useSelector((s: RootState) => s.openGroup.archives);

  switch (view) {
    case "overview": {
      return (
        <FadeIn keyValue="overview-fade-in">
          <GroupCalandar />
        </FadeIn>
      );
    }
    case "events": {
      return (
        <FadeIn keyValue="group-events-fade-in">
          <RenderEventsForGroup />
        </FadeIn>
      );
    }
    case "group history": {
      return (
        <FadeIn keyValue="group-history-fade-in">
          <RenderGroupHistory displayed={view} isMobile={isMobile} />
        </FadeIn>
      );
    }
    case "archives": {
      return (
        <FadeIn keyValue="archives-fade-in">
          <AsyncStateRenderer
            state={archives}
            empty={() => (
              <OpenedGroupFallback
              />
            )}
          >
            {(archivedEvents) => (
              <Archives archivedEvents={archivedEvents} isMobile={isMobile} />
            )}
          </AsyncStateRenderer>
        </FadeIn>
      );
    }

    default: {
      return assertNever(view);
    }
  }
}
