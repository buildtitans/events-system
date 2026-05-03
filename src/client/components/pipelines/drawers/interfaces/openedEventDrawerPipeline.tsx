"use client";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import RenderEventDrawerContents from "./renderEventDrawer";
import DrawerSpinner from "../../../ui/feedback/pending/drawerSpinner";
import { JSX } from "react";
import { useHydrateEventDrawer } from "@/src/lib/hooks/hydration/useHydrateEventDrawer";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";

export default function OpenedEventDrawerPipeline(): JSX.Element | null {
  useHydrateEventDrawer();
  const openedEvent = useSelector((s: RootState) => s.eventDrawer.event);
  const drawerViewerRole = useSelector(
    (s: RootState) => s.eventDrawer.drawerViewerRole,
  );
  const { numberAttending, numberInterested, groupName, groupSlug } =
    useSelector((s: RootState) => s.eventDrawer, shallowEqual);

  switch (openedEvent.status) {
    case "ready":
      return (
        <RenderEventDrawerContents
          role={drawerViewerRole}
          event={openedEvent.data}
          numAttendants={numberAttending}
          numInterested={numberInterested}
          name={groupName}
          slug={groupSlug}
        />
      );

    case "failed":
      return <AsyncFailedFallback message={openedEvent.error} />;

    case "pending": {
      return <DrawerSpinner />;
    }

    default: {
      return <DrawerSpinner />;
    }
  }
}
