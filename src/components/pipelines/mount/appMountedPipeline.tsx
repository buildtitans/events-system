"use client";
import { JSX } from "react";
import type { MountStatus } from "@/src/lib/types/tokens/types";
import type { DomainStateType } from "@/src/lib/store/sync/syncDomains";
import ClientComponentsShell from "../../shell/ClientComponentsShell";
import Container from "@mui/material/Container";
import Spinner from "../../ui/feedback/pending/spinner";

export const AppMountedPipeline = (
    status: MountStatus,
    children: React.ReactNode,
    domains: DomainStateType
): JSX.Element | null => {

    switch (status) {
        case "active":
            return (
                <ClientComponentsShell
                    domains={domains}
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

            )

        default: {
            return (
                <Spinner />
            )
        }
    }
}


