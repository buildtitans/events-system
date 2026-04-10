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
      maxWidth="lg"
      component="main"
      sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
    >
      <TopNav />
      <TopLayerHost />
      {children}
      <Footer />
    </Container>
  );
}
