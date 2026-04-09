import cors from "@fastify/cors";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { registerContextHook } from "../hooks/registerSessionHook";
import { createContext } from "@/src/server/core/context/context";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { db, DBClient } from "@/src/server/core/db";
import { type AppRouter, appRouter } from "@/src/server/core/router/router";
import type { TRPCError } from "@trpc/server";
import { getEnv } from "@/src/server/core/lib/init/getEnv";

function buildServer() {
  const cookie_secret = getEnv("cookies_secret");
  const serializers = {
    res(reply: { statusCode: number }) {
      return {
        statusCode: reply.statusCode,
      };
    },
    req(request: { method: string; url: string }) {
      return {
        method: request.method,
        url: request.url,
      };
    },
  };
  const logger =
    process.env.NODE_ENV === "production"
      ? { serializers }
      : {
          transport: {
            target: "pino-pretty",
          },
          serializers,
        };

  const app = Fastify({
    trustProxy: true,
    logger,
    routerOptions: {
      maxParamLength: 1000,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    app.register(cors, {
      origin: getEnv("dev_client_url"),
      credentials: true,
    });
  }

  app.decorate("db", new DBClient(db));
  app.register(fastifyCookie, {
    secret: cookie_secret,
  });
  registerContextHook(app);

  app.register(fastifyTRPCPlugin, {
    prefix: "/api/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }: { path?: string; error: TRPCError }) {
        console.error(`Error in tRPC handler on path ${path} — ${error}`);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  return app;
}

export { buildServer };
