"use client";
import type { JSX, PropsWithChildren } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import Box from "@mui/material/Box";
import {
  createEventDrawerContextChipSx,
  createEventDrawerContextRowSx,
  createEventDrawerDescriptionSx,
  createEventDrawerEyebrowSx,
  createEventDrawerHeaderSx,
  createEventDrawerRootSx,
  createEventDrawerTitleSx,
} from "@/src/client/styles/sx/createEventDrawer";

type CreateEventDrawerShellProps = PropsWithChildren<{
  groupName: string;
  groupLocation: string | null;
}>;

export default function CreateEventDrawerShell({
  groupName,
  groupLocation,
  children,
}: CreateEventDrawerShellProps): JSX.Element {
  return (
    <Stack sx={createEventDrawerRootSx}>
      <Stack sx={createEventDrawerHeaderSx}>
        <Typography component="span" sx={createEventDrawerEyebrowSx}>
          Organizer
        </Typography>
        <Typography component="h1" sx={createEventDrawerTitleSx}>
          Create Event
        </Typography>
        <Typography component="p" sx={createEventDrawerDescriptionSx}>
          Add a new event for {groupName} and publish it to the community
          schedule.
        </Typography>
        <Box sx={createEventDrawerContextRowSx}>
          <Box sx={createEventDrawerContextChipSx}>
            <Groups2RoundedIcon sx={{ fontSize: "1rem", color: "#7cc6ff" }} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {groupName}
            </Typography>
          </Box>
          {groupLocation && (
            <Box sx={createEventDrawerContextChipSx}>
              <PlaceRoundedIcon
                sx={{ fontSize: "1rem", color: "rgba(255, 255, 255, 0.6)" }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {groupLocation}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>

      {children}
    </Stack>
  );
}
