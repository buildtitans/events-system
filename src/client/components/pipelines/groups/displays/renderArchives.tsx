"use client";
import type { JSX } from "react";
import type { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import { RelativeSpinner } from "@/src/client/components/ui/feedback/pending/spinner";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";
import OpenedGroupFallback from "@/src/client/components/ui/feedback/fallbacks/groupFallback";
import FadeIn from "@/src/client/components/ui/box/motionboxes/fadeIn";
import Archives from "@/src/client/components/sections/group/openedGroup/displays/archives";
import { Stack } from "@mui/material";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

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

    case "n/a": {
      return (
        <OpenedGroupFallback
        />
      );
    }

    default: {
      assertNever(archive);
    }
  }
}
