"use client";
import type { JSX } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import MyGroups from "./myGroups";
import Divider from "@mui/material/Divider";

type AccountDetailsProps = {
  email: string;
};

export default function AccountDetails({
  email,
}: AccountDetailsProps): JSX.Element {
  return (
    <Container
      disableGutters
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100svh",
      }}
    >
        <MyGroups />
    </Container>
  );
}
