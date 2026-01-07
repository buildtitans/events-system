import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/src/trpc/router";
import SuperJSON from "superjson";

export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            transformer: SuperJSON,
        }),
    ],
});
