"use client";
import TopNav from "@/src/components/global/TopNav";
import TopLayerHost from "@/src/components/layers/topLayerHost";
import Footer from "@/src/components/sections/footer/footer";
import { JSX } from "react";
import { PropsWithChildren } from "react";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import SimpleBackdrop from "../ui/feedback/pending/backdrop";
import { Stack } from "@mui/material";
type ClientComponentsShellProps = PropsWithChildren;

export default function ClientComponentsShell({
  children,
}: ClientComponentsShellProps): JSX.Element {
  const initialLoadStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);

  if(initialLoadStatus === "pending") {
    return (
      <SimpleBackdrop />
    )
  }

  return (
    <Container
      key="content_container"
      maxWidth={false}
      component="main"
    >
      <TopNav />
      <TopLayerHost />
      <Stack
      direction={"column"}
      gap={4}
      marginTop={10}
      >
      {children}
      </Stack>
      <Footer />
    </Container>
  );
}
