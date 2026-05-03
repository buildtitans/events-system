"use client";
import type { JSX, PropsWithChildren } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  createGroupDrawerDescriptionSx,
  createGroupDrawerEyebrowSx,
  createGroupDrawerHeaderSx,
  createGroupDrawerRootSx,
  createGroupDrawerTitleSx,
} from "@/src/styles/sx/createGroupDrawer";

export default function CreateGroupDrawerShell({
  children,
}: PropsWithChildren): JSX.Element {
  return (
    <Stack sx={createGroupDrawerRootSx}>
      <Stack sx={createGroupDrawerHeaderSx}>
        <Typography component="span" sx={createGroupDrawerEyebrowSx}>
          Workspace
        </Typography>
        <Typography component="h1" sx={createGroupDrawerTitleSx}>
          Establish a New Group
        </Typography>
        <Typography component="p" sx={createGroupDrawerDescriptionSx}>
          Start a new community, define what it is about, and give members a
          place to gather around a shared topic.
        </Typography>
      </Stack>

      {children}
    </Stack>
  );
}
