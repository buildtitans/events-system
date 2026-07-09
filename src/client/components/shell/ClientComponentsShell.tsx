"use client";
import TopNav from "@/src/client/components/global/nav/TopNav";
import TopLayerHost from "@/src/client/components/hosts/topLayerHost";
import Footer from "@/src/client/components/global/footer/footer";
import { JSX } from "react";
import { PropsWithChildren } from "react";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import SimpleBackdrop from "../ui/feedback/pending/backdrop";
import { Stack } from "@mui/material";
import FadeIn from "../ui/box/motionboxes/fadeIn";
import { InitialLoadErrorFallback } from "./InitialLoadErrorFallback";
import { AppUnavailableFallback } from "./AppUnavailableFallback";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
type ClientComponentsShellProps = PropsWithChildren;

export default function ClientComponentsShell({
  children,
}: ClientComponentsShellProps): JSX.Element {
  const appBoot = useSelector((s: RootState) => s.rendering.appBoot);

  switch (appBoot.status) {
    case "failed": {
      return (
        <FadeIn keyValue="initial-load-failure-fade-in-box">
          <InitialLoadErrorFallback message={appBoot.message} />
        </FadeIn>
      );
    }
    case "ready": {
      return (
        <FadeIn keyValue="client-component-shell-fade-in-box">
          <Container
            key="content_container"
            maxWidth={false}
            component="main"
            sx={{ py: 2 }}
          >
            <TopNav />
            <TopLayerHost />
            <Stack direction={"column"} gap={4} marginTop={10}>
              {children}
            </Stack>
            <Footer />
          </Container>
        </FadeIn>
      );
    }

    case "initial": {
      return (
        <FadeIn keyValue="appBoot-initial-fade-in">
          <SimpleBackdrop />
        </FadeIn>
      );
    }
    case "pending": {
      return (
        <FadeIn keyValue="initial-load-spinner-fade-in-box">
          <SimpleBackdrop />
        </FadeIn>
      );
    }

    case "n/a": {
      return (
        <FadeIn keyValue="app-boot-unavailable-fade-in">
          <AppUnavailableFallback message={appBoot.message} />
        </FadeIn>
      );
    }

    default: {
      return assertNever(appBoot);
    }
  }
}
