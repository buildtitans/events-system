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
import DashboardHeader from "../../ui/headers/dashboardHeader";
import { AsyncStateRenderer } from "../../pipelines/async/asyncStateRenderer";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import AccountDetails from "./accountDetails";

export default function DashboardPanel(): JSX.Element {
  const email = useSelector((s: RootState) => s.user.email);

  return (
    <Container component={"section"}>
      <Box sx={dashboardRootSx}>
        <Box sx={dashboardPanelSx}>
          <Box sx={dashboardHeaderInnerSx}>
            <DashboardHeader />
            <Divider sx={dashboardHeaderDividerSx} />
          </Box>
          <AsyncStateRenderer state={email} pending={() => <SimpleBackdrop />}>
            {(state) => <AccountDetails email={state} />}
          </AsyncStateRenderer>
        </Box>
      </Box>
    </Container>
  );
}
