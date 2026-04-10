"use client";
import TopNav from '@/src/components/global/TopNav';
import TopLayerHost from '@/src/components/layers/topLayerHost';
import Footer from "@/src/components/sections/footer/footer";
import { JSX } from "react";
import { PropsWithChildren } from "react";

type ClientComponentsShellProps = PropsWithChildren

export default function ClientComponentsShell({
    children,
}: ClientComponentsShellProps): JSX.Element {

    return (
        <>
            <TopNav />
            <TopLayerHost />
            {children}
            <Footer />
        </>
    )
}