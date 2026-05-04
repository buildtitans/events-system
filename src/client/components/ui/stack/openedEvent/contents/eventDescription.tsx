"use client";
import Box from "@mui/material/Box";
import { type JSX } from "react";
import Typography from "@mui/material/Typography";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  openedEventBodyTextSx,
  openedEventSectionLabelSx,
  openedEventSectionSx,
} from "@/src/client/styles/sx/openedEventDrawer";

export default function EventDescription({
  description,
}: {
  description: EventSchemaType["description"];
}): JSX.Element {
  return (
    <Box sx={openedEventSectionSx}>
      <Typography component="span" sx={openedEventSectionLabelSx}>
        Event Details
      </Typography>

      <Typography component="p" sx={openedEventBodyTextSx}>
        {description}
      </Typography>
    </Box>
  );
}
