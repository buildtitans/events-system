import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/src/server/core/router/router";
import superjson from "superjson";

const trpcUrl =
  typeof window !== "undefined"
    ? "/api/trpc"
    : process.env.NODE_ENV === "production"
      ? "http://127.0.0.1:3001/api/trpc"
      : process.env.NEXT_PUBLIC_API_URL!;

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: trpcUrl,
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
