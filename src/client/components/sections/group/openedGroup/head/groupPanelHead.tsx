"use client";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  openedGroupHeroHeaderDescriptionSx,
  openedGroupHeroTitleSx,
} from "@/src/client/styles/sx/openedGroupHero";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import GroupPanelEyebrow from "./groupPanelEyebrow";

export default function GroupPanelHead({
  groupName,
  category,
}: {
  groupName: string;
  category: CategorySchemaType["name"];
}): JSX.Element | null {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center",
      }}
    >
      <GroupPanelEyebrow category={category} />
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
