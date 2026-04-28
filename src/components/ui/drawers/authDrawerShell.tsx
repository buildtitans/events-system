"use client";
import type { JSX, PropsWithChildren } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  authDrawerDescriptionSx,
  authDrawerEyebrowSx,
  authDrawerHeaderSx,
  authDrawerRootSx,
  authDrawerTitleSx,
} from "@/src/styles/sx/authDrawer";

type AuthDrawerShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export default function AuthDrawerShell({
  eyebrow,
  title,
  description,
  children,
}: AuthDrawerShellProps): JSX.Element {
  return (
    <Stack sx={authDrawerRootSx}>
      <Stack sx={authDrawerHeaderSx}>
        <Typography component="span" sx={authDrawerEyebrowSx}>
          {eyebrow}
        </Typography>
        <Typography component="h1" sx={authDrawerTitleSx}>
          {title}
        </Typography>
        <Typography component="p" sx={authDrawerDescriptionSx}>
          {description}
        </Typography>
      </Stack>

      {children}
    </Stack>
  );
}
