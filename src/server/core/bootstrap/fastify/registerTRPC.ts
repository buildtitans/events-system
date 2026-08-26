import type { FastifyInstance } from "fastify";
import type { AppRouter } from "@/src/server/core/router/router";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { createContext } from "@/src/server/core/context/context";
import { appRouter } from "@/src/server/core/router/router";
import { TRPCErrorLogging } from "@/src/server/core/bootstrap/fastify/types";
import { IApplicationAPI } from "../../service/applicationApi";

export function registerTRPC(app: FastifyInstance, api: IApplicationAPI): void {
  app.register(fastifyTRPCPlugin, {
    prefix: "/api/trpc",
    trpcOptions: createTRPCOptions(app, api),
  });
}

function createTRPCOptions(app: FastifyInstance, api: IApplicationAPI) {
  return {
    router: appRouter,
    createContext: ({ req, res, info }) =>
      createContext({ req, res, info }, api),
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
