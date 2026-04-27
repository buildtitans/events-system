"use client";
import Stack from "@mui/material/Stack";
import CalandarHeader from "@/src/components/ui/headers/calandarHeader";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RenderGroupCalandar } from "@/src/components/pipelines/groups/renderGroupCalandar";

export default function GroupCalandar(): JSX.Element {
  const groupEvents = useSelector((s: RootState) => s.openGroup.flattenedEvents)

  return (
    <Stack gap={6}>
      <CalandarHeader />
      <RenderGroupCalandar flattenedGroupEvents={groupEvents} />
    </Stack>
  );
}
