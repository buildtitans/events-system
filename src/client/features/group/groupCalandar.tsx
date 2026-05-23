"use client";
import Stack from "@mui/material/Stack";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RenderGroupCalandar } from "../../components/pipelines/groups/displays/renderGroupCalandar";

export default function GroupCalandar(): JSX.Element {
  const groupEvents = useSelector((s: RootState) => s.openGroup.flattenedEvents)

  return (
    <Stack gap={6}>
      <RenderGroupCalandar flattenedGroupEvents={groupEvents} />
    </Stack>
  );
}
