"use client";
import { JSX } from "react";
import type { MountStatus } from "@/src/lib/types/tokens/types";
import type { DomainStateType } from "@/src/lib/store/sync/syncDomains";
import ClientComponentsShell from "../../shell/ClientComponentsShell";
import CircularIndeterminate from "../../ui/feedback/pending/spinner";

export const appMountedPipeline = (
    status: MountStatus,
    children: React.ReactNode,
    domains: DomainStateType
): JSX.Element | null => {

    switch (status) {
        case "active":
            return (
                <ClientComponentsShell
                    domains={domains}
                    children={children}
                />
            )

        default: {
            return (
                <CircularIndeterminate />
            )
        }
    }
}


