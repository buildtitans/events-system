"use client";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import RenderEventDrawerContents from "./renderEventDrawer";
import DrawerSpinner from "../../../ui/feedback/pending/drawerSpinner";
import { JSX } from "react";
import { AsyncStateRenderer } from "../../async/asyncStateRenderer";

export default function OpenedEventDrawerPipeline(): JSX.Element | null {
  const openedEvent = useSelector((s: RootState) => s.eventDrawer.event);
  const drawerViewerRole = useSelector(
    (s: RootState) => s.eventDrawer.drawerViewerRole,
  );
  const { numberAttending, numberInterested, groupName, groupSlug } =
    useSelector((s: RootState) => s.eventDrawer, shallowEqual);

  return (
    <AsyncStateRenderer state={openedEvent} pending={() => (<DrawerSpinner />)}>
      {(event) => (
        <RenderEventDrawerContents
          role={drawerViewerRole}
          event={event}
          numAttendants={numberAttending}
          numInterested={numberInterested}
          name={groupName}
          slug={groupSlug}
        />
      )}
    </AsyncStateRenderer>
  )
}
