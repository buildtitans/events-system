import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/src/server/src/router/router";
import superjson from "superjson";
import { devServerBaseUrl } from "../lib/utils/init/requireEnv";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: devServerBaseUrl.FASTIFY_SERVER_URL,
      transformer: superjson,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
