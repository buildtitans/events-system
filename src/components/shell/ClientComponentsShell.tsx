"use client";
import AppAppBar from "@/src/components/ui/nav/AppBar";
import TopLayerHost from '@/src/components/layers/topLayerHost';
import Container from "@mui/material/Container";
import AppBootstrapHydrator from "@/src/components/hydration/AppBootstrapHydrator";
import Footer from "@/src/components/sections/footer/footer";
import { JSX } from "react";
import type { DomainStateType } from "@/src/lib/store/sync/syncDomains";

type ClientComponentsShellProps = {
    children: React.ReactNode, domains: DomainStateType
}

export default function ClientComponentsShell({
    children,
    domains
}: ClientComponentsShellProps): JSX.Element {

    return (
        <>
            <AppAppBar
                key="navigation_bar"
            />

            <TopLayerHost />

            <AppBootstrapHydrator
                domains={domains}
            />

            <Container
                key="content_container"
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
            >
                {children}
            </Container>

            <Footer />
        </>
    )
}