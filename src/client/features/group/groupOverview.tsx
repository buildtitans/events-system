"use client";
import Stack from "@mui/material/Stack";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { AsyncStateRenderer } from "../../components/pipelines/async/asyncStateRenderer";
import Calandar from "../../components/ui/dates/calandar";
import OpenedGroupFallback from "@/src/client/components/ui/feedback/fallbacks/widgets/groupFallback";
import UpNextEvent from "./upNextEvent";
import UpNextEventSkeleton from "./upNextEventSkeleton";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import UpNextEventFallback from "./upNextEventFallback";

export default function GroupOverview(): JSX.Element {
  const calandar = useSelector((s: RootState) => s.openGroup.calandar);
  const nextEvent = useSelector((s: RootState) => s.openGroup.nextEvent);
  const { handleOpenEvent } = useSelectEvent();

  return (
    <Stack gap={6} direction={{ xs: "column", md: "row" }}>
      <AsyncStateRenderer
        state={calandar}
        empty={() => <OpenedGroupFallback />}
      >
        {(state) => <Calandar history={state} />}
      </AsyncStateRenderer>
      <AsyncStateRenderer
        state={nextEvent}
        pending={() => <UpNextEventSkeleton />}
        empty={() => <UpNextEventFallback />}
      >
        {(state) => (
          <UpNextEvent
            event={state}
            onAction={handleOpenEvent}
            actionLabel="View Event"
          />
        )}
      </AsyncStateRenderer>
    </Stack>
  );
}
