import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/src/trpc/router";
import superjson from "superjson";
import { env } from "../lib/utils/init/requireEnv";

export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: env.FASTIFY_SERVER_URL,
            transformer: superjson,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include"
                });
            },
        }),
    ],
});
