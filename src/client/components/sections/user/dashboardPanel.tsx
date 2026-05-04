"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { Box, Container, Divider } from "@mui/material";
import {
  dashboardRootSx,
  dashboardPanelSx,
  dashboardHeaderInnerSx,
  dashboardHeaderDividerSx,
} from "@/src/client/styles/sx/dashboardHeader";
import type { JSX } from "react";
import RenderUserAccount from "../../pipelines/user/renderUserAccount";
import DashboardHeader from "../../ui/headers/dashboardHeader";

export default function DashboardPanel(): JSX.Element {
  const email = useSelector((s: RootState) => s.user.email);

  return (
    <Container
    component={"section"}
    >
<Box sx={dashboardRootSx}>
      <Box sx={dashboardPanelSx}>
        <Box sx={dashboardHeaderInnerSx}>
          <DashboardHeader />
        <Divider sx={dashboardHeaderDividerSx} />
        </Box>
        <RenderUserAccount email={email} />
      </Box>
    </Box>
    </Container>
    
  );
}
