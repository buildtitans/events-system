import type { FastifyInstance } from "fastify";
import type { AppRouter } from "@/src/server/core/router/router";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { createContext } from "@/src/server/core/context/context";
import { appRouter } from "@/src/server/core/router/router";
import { TRPCErrorLogging } from "@/src/server/core/bootstrap/fastify/types";

export function registerTRPC(app: FastifyInstance): void {
  app.register(fastifyTRPCPlugin, {
    prefix: "/api/trpc",
    trpcOptions: createTRPCOptions(app),
  });
}

function createTRPCOptions(app: FastifyInstance) {
  return {
    router: appRouter,
    createContext,
    onError: handleTRPCError(app),
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"];
}

function handleTRPCError(app: FastifyInstance): TRPCErrorLogging {
  return ({ path, error }) => {
    app.log.error({
      path,
      tRPCErrorCode: error.code,
      cause: error.cause,
    });
  };
}
