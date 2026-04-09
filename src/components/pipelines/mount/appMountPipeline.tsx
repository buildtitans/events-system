"use client";
import { JSX, PropsWithChildren } from "react";
import ClientComponentsShell from "../../shell/ClientComponentsShell";
import Container from "@mui/material/Container";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

type AppMountPipelineProps = PropsWithChildren<{
    children: React.ReactNode,
}>

export function AppMountPipeline({
    children,
}: AppMountPipelineProps): JSX.Element | null {
    const domainStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus)

    switch (domainStatus) {
        case "idle":
            return (
                <ClientComponentsShell
                >
                    <Container
                        key="content_container"
                        maxWidth="lg"
                        component="main"
                        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                    >
                        {children}
                    </Container>
                </ClientComponentsShell>

            );

        default: {
            return (
                <SimpleBackdrop />
            )
        }
    }
}


