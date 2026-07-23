"use client";
import Stack from "@mui/material/Stack";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { AsyncStateRenderer } from "../../components/pipelines/async/asyncStateRenderer";
import Calandar from "../../components/ui/dates/calandar";
import OpenedGroupFallback from "../../components/ui/feedback/fallbacks/widgets/groupFallback";

export default function GroupCalandar(): JSX.Element {
  const groupEvents = useSelector((s: RootState) => s.openGroup.calandar);

  return (
    <Stack gap={6}>
      <AsyncStateRenderer
        state={groupEvents}
        empty={() => <OpenedGroupFallback />}
      >
        {(state) => <Calandar history={state} />}
      </AsyncStateRenderer>
    </Stack>
  );
}
