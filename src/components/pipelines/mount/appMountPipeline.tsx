"use client";
import { JSX } from "react";
import ClientComponentsShell from "../../shell/ClientComponentsShell";
import Container from "@mui/material/Container";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import type { SyncDomainsResult } from "@/src/lib/store/sync/syncDomains";

export const AppMountPipeline = (
    children: React.ReactNode,
    domains: SyncDomainsResult
): JSX.Element | null => {

    switch (domains.status) {
        case "fulfilled":
            return (
                <ClientComponentsShell
                    domains={domains.data}
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


