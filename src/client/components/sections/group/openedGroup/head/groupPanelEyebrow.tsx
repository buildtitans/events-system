"use client";
import type { JSX } from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { openedGroupHeroEyebrowSx } from "@/src/client/styles/sx/openedGroupHero";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";

export default function GroupPanelEyebrow({
  category,
}: {
  category: CategorySchemaType["name"];
}): JSX.Element | null {
  const chipSx = {
    height: 24,
    borderRadius: 999,
    border: "1px solid rgba(124, 198, 255, 0.2)",
    backgroundColor: "rgba(124, 198, 255, 0.07)",
    color: "rgba(160, 215, 255, 0.88)",
    fontSize: "0.66rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    transform: "translateY(-2.65px)",
    "& .MuiChip-label": {
      px: 1.15,
    },
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems="center"
      gap={1.25}
    >
      <Typography sx={openedGroupHeroEyebrowSx}>Community</Typography>
      <Chip label={category} size="small" sx={chipSx} />
    </Stack>
  );
}
