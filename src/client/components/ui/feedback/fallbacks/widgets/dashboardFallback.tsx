"use client";
import { JSX } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  noGroupsFallbackActionWrapSx,
  noGroupsFallbackDescriptionSx,
  noGroupsFallbackEyebrowSx,
  noGroupsFallbackHintSx,
  noGroupsFallbackIconWrapSx,
  noGroupsFallbackPanelSx,
  noGroupsFallbackRootSx,
  noGroupsFallbackTitleSx,
} from "@/src/client/styles/sx/noGroupsFallback";
import DashboardFallbackActionButton from "../buttons/dashboardFallbackActionButton";

export type DashboardFallbackProps = {
  eyeBrow: "Workspace";
  fallbackTitle:
    | "No groups created yet"
    | "Nothing joined yet"
    | "No commitments yet";
  fallbackBody: string;
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  actionTitle?: string;
  actionCaption?: string;
  handleClick?: () => void;
};

export default function DashboardFallback({
  eyeBrow,
  fallbackTitle,
  fallbackBody,
  actionCaption,
  icon,
  actionTitle,
  startIcon,
  handleClick,
}: DashboardFallbackProps): JSX.Element {
  return (
    <Box sx={noGroupsFallbackRootSx}>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        spacing={0}
        sx={noGroupsFallbackPanelSx}
      >
        <Box component={"header"} sx={noGroupsFallbackIconWrapSx}>
          {icon}
        </Box>

        <Box>
          <Typography variant="overline" sx={noGroupsFallbackEyebrowSx}>
            {eyeBrow}
          </Typography>
          <Typography variant="h4" sx={noGroupsFallbackTitleSx}>
            {fallbackTitle}
          </Typography>
          <Typography variant="body1" sx={noGroupsFallbackDescriptionSx}>
            {fallbackBody}
          </Typography>
        </Box>

        <Typography variant="body2" sx={noGroupsFallbackHintSx}>
          {actionCaption}
        </Typography>

        <Box sx={noGroupsFallbackActionWrapSx}>
          <DashboardFallbackActionButton
            startIcon={startIcon}
            handleClick={handleClick}
            actionTitle={actionTitle}
          />
        </Box>
      </Stack>
    </Box>
  );
}
