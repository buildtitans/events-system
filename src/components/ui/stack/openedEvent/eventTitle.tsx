"use client";
import Box from "@mui/material/Box";
import { type JSX } from "react";
import Typography from "@mui/material/Typography";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  openedEventTitleSx,
} from "@/src/styles/sx/openedEventDrawer";


export default function EventTitle({
  title,
}: {
  title: EventSchemaType["title"];
}): JSX.Element {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        component="h2"
        sx={openedEventTitleSx}
      >
        {title}
      </Typography>
    </Box>
  );
}
