"use client";
import type { JSX } from "react";
import Container from "@mui/material/Container";
import RenderAccountView from "../../pipelines/user/renderAccountView";

type AccountDetailsProps = {
  email: string;
};

export default function AccountDetails({
}: AccountDetailsProps): JSX.Element {
  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100svh",
      }}
    >
      <RenderAccountView />
    </Container>
  );
}
