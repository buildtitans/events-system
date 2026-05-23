"use client";
import { RenderEventsForGroup } from "../displays/renderEventsForGroup";
import { JSX } from "react";
import { CurrentDisplay } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import RenderGroupHistory from "../displays/renderGroupHistory";
import GroupCalandar from "@/src/client/features/group/groupCalandar";
import type { OpenedGroupSection } from "@/src/lib/store/slices/groups/types";
import FadeIn from "../../../ui/box/motionboxes/fadeIn";
import AsyncFailedFallback from "../../../ui/feedback/failure/asyncFailedFallback";
import RenderArchives from "../displays/renderArchives";

type RenderCurrentViewProps = {
  view: CurrentDisplay;
  isMobile: boolean;
};

export default function RenderCurrentView({
  view,
  isMobile,
}: RenderCurrentViewProps): JSX.Element {
  switch (view) {
    case "overview": {
      return <GroupCalandar />;
    }

    case "group history": {
      return <RenderGroupHistory isMobile={isMobile} />;
    }

    case "events": {
      <RenderEventsForGroup />;
    }

    default: {
      return <RenderEventsForGroup />;
    }
  }
}

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
      return (
        <FadeIn keyValue="default-fade-in">
          <AsyncFailedFallback />
        </FadeIn>
      );
    }
  }
}
