"use client";
import type { JSX } from "react";
import type { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import Spinner, { RelativeSpinner } from "@/src/client/components/ui/feedback/pending/spinner";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";
import OpenedGroupFallback from "@/src/client/components/ui/feedback/fallbacks/groupFallback";
import FadeIn from "@/src/client/components/ui/box/motionboxes/fadeIn";
import Archives from "@/src/client/components/sections/group/openedGroup/displays/archives";
import { Box, Stack } from "@mui/material";

type RenderGroupHistoryProps = {
  isMobile: boolean;
};

export default function RenderArchives({
  isMobile,
}: RenderGroupHistoryProps): JSX.Element {
  const archive = useSelector((s: RootState) => s.openGroup.archives);

  switch (archive.status) {
    case "initial":
    case "pending": {
        return (
        <FadeIn keyValue="spinner-fade-in-box">
          <Stack
          alignItems={"center"}
          justifyContent={"center"}
          minHeight={"50dvh"}
          sx={{
            height: "100%",
            width: "100%",
          }}
          >
            <RelativeSpinner />
          </Stack>
        </FadeIn>
      );
    }
    case "ready": {

      return (
        <FadeIn keyValue="archives-fade-in-box">
          <Archives archivedEvents={archive.data} isMobile={isMobile} />
        </FadeIn>
      );
    }
    case "failed": {
      return <AsyncFailedFallback />;
    }

    default: {
      return (
        <OpenedGroupFallback
          eyeBrow={"Archives"}
          fallbackTitle={"No events archived"}
          fallbackDescripton={
            "This group has not cancelled any events yet, so there are no archives to show right now. Whenever you do choose to cancel an event, you can find them here to view or reschedule."
          }
          fallbackCaption={
            "Once an event is past the date scheduled when it was created, you can no longer rescind cancellation."
          }
        />
      );
    }
  }
}
