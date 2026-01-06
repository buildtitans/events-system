// src/trpc/client.ts (client-side usage)
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router";
import SuperJSON from "superjson";

export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            transformer: SuperJSON,
            maxURLLength: 0
        }),
    ],
});
