import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import {
  registerDevelopmentCors,
  registerTRPC,
} from "@/src/server/core/bootstrap";
import { registerRequestHook } from "@/src/server/core/hooks/registerRequestHook";
import { db, DBClient } from "@/src/server/core/db";
import { getEnv } from "@/src/server/core/lib/init/getEnv";
import { createLoggerOptions } from "@/src/server/core/lib/config/createLoggerOptions";

function buildServer() {
  const nodeEnv = process.env.NODE_ENV;
  const app = Fastify({
    trustProxy: true,
    logger: createLoggerOptions(nodeEnv),
    routerOptions: {
      maxParamLength: 1000,
    },
  });

  registerDevelopmentCors(app, nodeEnv);

  app.register(fastifyCookie, {
    secret: getEnv("cookies_secret"),
  });
  registerRequestHook({ db: new DBClient(db), app });
  registerTRPC(app);

  return app;
}

export { buildServer };
