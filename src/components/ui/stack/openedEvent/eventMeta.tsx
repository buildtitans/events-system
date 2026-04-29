"use client";
import Box from "@mui/material/Box";
import { type JSX } from "react";
import Typography from "@mui/material/Typography";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import {
  getOpenedEventMetaChipSx,
  getOpenedEventMetaIconSx,
  openedEventMetaRowSx,
} from "@/src/styles/sx/openedEventDrawer";

export default function EventMeta({
  startTime,
  location,
}: {
  startTime: string;
  location: EventSchemaType["meeting_location"];
}): JSX.Element {
  return (
    <Box sx={openedEventMetaRowSx}>
      <Box sx={getOpenedEventMetaChipSx(true)}>
        <EventRoundedIcon sx={getOpenedEventMetaIconSx(true)} />
        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: "0.7rem", md: "0.75rem"} }}>
          {startTime}
        </Typography>
      </Box>

      <Box sx={getOpenedEventMetaChipSx()}>
        <PlaceRoundedIcon sx={getOpenedEventMetaIconSx()} />
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", md: "0.75rem"} }}>
          {location}
        </Typography>
      </Box>
    </Box>
  );
};