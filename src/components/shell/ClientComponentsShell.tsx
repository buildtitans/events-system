"use client";
import TopNav from "@/src/components/ui/nav/TopNav";
import TopLayerHost from '@/src/components/layers/topLayerHost';
import AppBootstrapHydrator from "@/src/components/hydration/AppBootstrapHydrator";
import Footer from "@/src/components/sections/footer/footer";
import { JSX } from "react";
import type { DomainStateType } from "@/src/lib/types/server/types";
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
            <TopNav />
            <TopLayerHost />
            <AppBootstrapHydrator
                domains={domains}
            />
            {children}
            <Footer />
        </>
    )
}