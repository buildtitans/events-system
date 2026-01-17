"use client"
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/src/trpc/router";
import SuperJSON from "superjson";

export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3001/trpc",
            transformer: SuperJSON,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include"
                });
            },
        }),
    ],
});
