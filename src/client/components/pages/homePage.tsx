"use client";
import type { JSX } from "react";
import HomeContent from "@/src/client/components/sections/home/homeContent";
import HomeHeadSection from "../sections/headers/homeHeadSection";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import LandingContentContainer from "../containters/landingContentContainer";

function HomePage(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minHeight: "100svh",
        minWidth: "100%",
      }}
    >
      <LandingContentContainer isMobile={isMobile}>
      <Stack gap={4}>
<HomeHeadSection  
      isMobile={isMobile}
      />
      <HomeContent 
      isMobile={isMobile}
      />  
      </Stack>
      
      </LandingContentContainer>
    </Stack>
  );
}

export default HomePage;
