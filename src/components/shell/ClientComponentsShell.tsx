"use client";
import AppAppBar from "@/src/components/ui/nav/AppBar";
import TopLayerHost from '@/src/components/layers/topLayerHost';
import AppBootstrapHydrator from "@/src/components/hydration/AppBootstrapHydrator";
import Footer from "@/src/components/sections/footer/footer";
import { JSX } from "react";
import type { DomainStateType } from "@/src/lib/store/sync/syncDomains";
import { PropsWithChildren } from "react";

type ClientComponentsShellProps = PropsWithChildren<{
    domains: DomainStateType
}>

export default function ClientComponentsShell({
    children,
    domains
}: ClientComponentsShellProps): JSX.Element {

    return (
        <>
            <AppAppBar />
            <TopLayerHost />
            <AppBootstrapHydrator
                domains={domains}
            />
            {children}
            <Footer />
        </>
    )
}