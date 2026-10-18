"use client";
import type { JSX } from "react";
import OpenedEvent from "@/src/client/components/ui/stack/openedEvent/OpenedEvent";
import CheckOutGroupButton from "../buttons/checkOutGroupButton";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  openedEventDrawerInnerSx,
  openedEventDrawerRootSx,
} from "@/src/client/styles/sx/openedEventDrawer";

type AnonEventDrawerProps = {
  hydrated: HydratedEventSchemaType;
};

export default function AnonEventDrawer({
  hydrated,
}: AnonEventDrawerProps): JSX.Element {
  return (
    <Box sx={openedEventDrawerRootSx}>
      <Stack sx={openedEventDrawerInnerSx}>
        <OpenedEvent hydrated={hydrated} />

        <CheckOutGroupButton event={hydrated} />
      </Stack>
    </Box>
  );
}
