import { TRPC_ROUTE, trpcClientUrl } from "@/src/lib/utils/init/requireEnv";

const devServerUrl = trpcClientUrl.FASTIFY_SERVER_URL;

export function configureTrpcRoute(isProduction: boolean, isBrowser: boolean) {
  switch (isProduction) {
    case true: {
      if (isBrowser) {
        return TRPC_ROUTE;
      } else {
        return `http://127.0.0.1:3001${TRPC_ROUTE}`;
      }
    }

    default: {
      return devServerUrl;
    }
  }
}
