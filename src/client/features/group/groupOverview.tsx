"use client";
import Stack from "@mui/material/Stack";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import AsyncStateWithRefreshRenderer from "../../components/pipelines/async/asyncStateWithRefreshRenderer";
import Calandar from "../../components/ui/dates/calandar";
import OpenedGroupFallback from "@/src/client/components/ui/feedback/fallbacks/widgets/groupFallback";
import UpNextEvent from "./upNextEvent";
import UpNextEventSkeleton from "./upNextEventSkeleton";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import UpNextEventFallback from "./upNextEventFallback";

export default function GroupOverview(): JSX.Element {
  const events = useSelector((s: RootState) => s.openGroup.events);
  const { handleOpenEvent } = useSelectEvent();

  return (
    <Stack gap={6} direction={{ xs: "column", md: "row" }}>
      <AsyncStateWithRefreshRenderer
        state={events}
        selectContent={(data) => data.calandar}
        empty={() => <OpenedGroupFallback />}
        ready={(calandar) => <Calandar history={calandar} />}
      />
      <AsyncStateWithRefreshRenderer
        state={events}
        selectContent={(data) => data.next_event}
        pending={() => <UpNextEventSkeleton />}
        empty={() => <UpNextEventFallback />}
        ready={(nextEvent) => (
          <UpNextEvent
            hydrated={nextEvent}
            onAction={handleOpenEvent}
            actionLabel="View Event"
          />
        )}
      />
    </Stack>
  );
}
