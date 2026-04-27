"use client";
import Box from "@mui/material/Box";
import type { JSX } from "react";
import { CategoryChips } from "@/src/features/events/categoryChips";
import { LandingHeader } from "@/src/components/ui/headers/landingHeader";
import Container from "@mui/material/Container";
import HomeContent from "../home/homeContent";

export default function HomeHeadSection({
  isMobile,
}: {
  isMobile: boolean;
}): JSX.Element {
  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <LandingHeader isMobile={isMobile} />
      <Box
        sx={{
          mt: { xs: 3, md: 4 },
          pt: { xs: 2.5, md: 3 },
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <CategoryChips isMobile={isMobile} />
      </Box>
    </Box>
  );
}
