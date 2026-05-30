"use client";
import { RenderEventsForGroup } from "../displays/renderEventsForGroup";
import { JSX } from "react";
import RenderGroupHistory from "../displays/renderGroupHistory";
import GroupCalandar from "@/src/client/features/group/groupCalandar";
import type { OpenedGroupSection } from "@/src/lib/store/slices/groups/types";
import FadeIn from "../../../ui/box/motionboxes/fadeIn";
import RenderArchives from "../displays/renderArchives";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type RenderGroupDisplayProps = {
  view: OpenedGroupSection;
  isMobile: boolean;
};

export function RenderGroupDisplay({
  view,
  isMobile,
}: RenderGroupDisplayProps): JSX.Element {
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
          <RenderGroupHistory isMobile={isMobile} />
        </FadeIn>
      );
    }
    case "archives": {
      return (
        <FadeIn keyValue="archives-fade-in">
          <RenderArchives isMobile={isMobile} />
        </FadeIn>
      );
    }

    default: {
      return assertNever(view);
    }
  }
}
