"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import RenderEventDrawerContents from "./renderEventDrawer";
import DrawerSpinner from "../../../ui/feedback/pending/drawerSpinner";
import type { JSX } from "react";
import { AsyncStateRenderer } from "../../async/asyncStateRenderer";

export default function OpenedEventDrawerPipeline(): JSX.Element | null {
  const openedEvent = useSelector((s: RootState) => s.eventDrawer.event);

  return (
    <AsyncStateRenderer state={openedEvent} pending={() => <DrawerSpinner />}>
      {(hydrated) => <RenderEventDrawerContents hydrated={hydrated} />}
    </AsyncStateRenderer>
  );
}
