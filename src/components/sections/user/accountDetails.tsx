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
        width: "60%",
        height: "100%",
        minHeight: "100svh",
      }}
    >
      <Stack
        direction={"column"}
        gap={8}
        divider={<Divider sx={{ opacity: 0.9 }} />}
      >
        <MyGroups />
      </Stack>
    </Container>
  );
}
