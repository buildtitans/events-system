"use client";
import type { TimelineElementSchemaType } from "@/src/schemas/groups/timelineSchema";
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
  const hydrated = useSelector((s: RootState) => s.openGroup.group);
  const { handleOpenEvent } = useSelectEvent();

  return (
    <Stack gap={6} direction={{ xs: "column", md: "row" }}>
      <AsyncStateRenderer
        state={hydrated}
        empty={() => <OpenedGroupFallback />}
      >
        {(state) => <RenderGroupCalendar calandar={state.meta.events.calandar} />}
      </AsyncStateRenderer>
      <AsyncStateRenderer
        state={hydrated}
        pending={() => <UpNextEventSkeleton />}
        empty={() => <UpNextEventFallback />}
      >
        {(state) => {
          if (state.meta.events.next_event) {
            return (
              <UpNextEvent
                hydrated={state.meta.events.next_event}
                onAction={handleOpenEvent}
                actionLabel="View Event"
              />
            );
          } else {
            return <UpNextEventFallback />;
          }
        }}
      </AsyncStateRenderer>
    </Stack>
  );
}

function RenderGroupCalendar({ calandar }: { calandar: TimelineElementSchemaType[] }): JSX.Element {
  if (calandar.length === 0) {
    return <OpenedGroupFallback />;
  }
  return <Calandar history={calandar} />;
}
