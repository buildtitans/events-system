"use client";
import type { JSX } from "react";
import type { MyGroupsState } from "@/src/lib/store/slices/user/types";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";
import NoGroup from "../../ui/feedback/failure/noGroups";
import RenderGroupsOrFallback from "./renderGroupsOrFallback";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";
import { Container, Fade } from "@mui/material";
import FadeIn from "../../ui/box/motionboxes/fadeIn";

type RenderMyGroupsProps = {
  myGroups: MyGroupsState;
};

export default function RenderMyGroups({
  myGroups,
}: RenderMyGroupsProps): JSX.Element | null {
  switch (myGroups.status) {
    case "ready": {
      return (
        <FadeIn keyValue={"my-groups-or-fallback-container"}>
          <Container>
            <RenderGroupsOrFallback pages={myGroups.data} />
          </Container>
        </FadeIn>
      );
    }

    case "pending": {
      return (
        <FadeIn keyValue="pending-fade-wrapper">
          <RelativeSpinner />;
        </FadeIn>
      );
    }

    case "n/a": {
      return (
        <FadeIn keyValue="na-fade-wrapper">
          <NoGroup />
        </FadeIn>
      )
    }

    case "failed": {
      return (
        <FadeIn keyValue="failed-fallback-fade-wrapper">
          <AsyncFailedFallback message={myGroups.error} />
        </FadeIn>
      )
    }

    default: {
      return null;
    }
  }
}
