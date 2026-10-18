"use client";
import { Box, Stack } from "@mui/material";
import {
  openedEventDrawerInnerSx,
  openedEventDrawerRootSx,
} from "@/src/client/styles/sx/openedEventDrawer";
import { PropsWithChildren } from "react";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import MemberAndOrganizerActions from "./contents/memberAndOrganizerActions";

type MemberEventDrawerProps = PropsWithChildren<{
  hydrated: HydratedEventSchemaType;
}>;

export default function MemberEventDrawer({
  hydrated,
}: MemberEventDrawerProps) {
  return (
    <Box sx={openedEventDrawerRootSx}>
      <Stack sx={openedEventDrawerInnerSx}>
        <MemberAndOrganizerActions hydrated={hydrated} />
      </Stack>
    </Box>
  );
}
