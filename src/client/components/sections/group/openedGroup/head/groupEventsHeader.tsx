"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import Typography from "@mui/material/Typography";
import {
  openedGroupHeroEyebrowSx,
  openedGroupHeroHeaderDescriptionSx,
  openedGroupHeroTitleSx,
} from "@/src/client/styles/sx/openedGroupHero";

export default function GroupEventsHeader(
  { groupName }: { groupName: string },
): JSX.Element | null {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center",
      }}
    >
      <Typography component="span" sx={openedGroupHeroEyebrowSx}>
        Community
      </Typography>
      <Typography component="h1" sx={openedGroupHeroTitleSx}>
        {groupName}
      </Typography>
      <Typography component="p" sx={openedGroupHeroHeaderDescriptionSx}>
        Explore this community&apos;s details, organizer, and current schedule
        at a glance.
      </Typography>
    </Box>
  );
}
