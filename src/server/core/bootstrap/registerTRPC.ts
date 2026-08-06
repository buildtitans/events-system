import type { FastifyInstance } from "fastify";
import type { AppRouter } from "../router/router";
import type { TRPCError } from "@trpc/server";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { createContext } from "../context/context";
import { appRouter } from "../router/router";

export function registerTRPC(app: FastifyInstance): void {
  app.register(fastifyTRPCPlugin, {
    prefix: "/api/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }: { path?: string; error: TRPCError }) {
        app.log.error({
          path,
          tRPCErrorCode: error.code,
          cause: error.cause,
        });
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });
}
