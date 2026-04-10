import { PropsWithChildren, Suspense } from "react";
import Providers from "@/src/app/providers";
import { LinearLoader } from "../ui/feedback/pending/linearLoader";

type ClientShellProps = PropsWithChildren

export default async function ClientShell({ children }: ClientShellProps) {

    return(
        <Suspense fallback={<LinearLoader />}>
            <Providers
            >
            {children}
            </Providers>
        </Suspense>
    )

}