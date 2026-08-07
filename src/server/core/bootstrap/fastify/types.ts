import type { AppRouter } from "@/src/server/core/router/router";
import { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";

type TRPCErrorLogging = NonNullable<
  FastifyTRPCPluginOptions<AppRouter>["trpcOptions"]["onError"]
>;

export type { TRPCErrorLogging };
