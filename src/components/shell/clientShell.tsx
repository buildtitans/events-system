import { PropsWithChildren, Suspense } from "react";
import { syncDomains } from "@/src/lib/store/sync/syncDomains";
import Providers from "@/src/app/providers";
import { LinearLoader } from "../ui/feedback/pending/linearLoader";

type ClientShellProps = PropsWithChildren

export default async function ClientShell({ children }: ClientShellProps) {
    const domains = await syncDomains();

    return(
        <Suspense fallback={<LinearLoader />}>
            <Providers
            domains={domains}
            >
            {children}
            </Providers>
        </Suspense>
    )

}