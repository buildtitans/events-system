import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/src/server/core/router/router";
import superjson from "superjson";
import { configureTrpcRoute } from "../lib/utils/init/configureTrpcRoute";

const isBrowser = typeof window !== "undefined";
const isProduction = process.env.NODE_ENV === "production";
const url = configureTrpcRoute(isProduction, isBrowser);

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: url,
      transformer: superjson,
      fetch(url, init) {
        return fetch(url, {
          ...init,
          credentials: "include",
        });
      },
    }),
  ],
});
