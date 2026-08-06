import cors from "@fastify/cors";
import { getEnv } from "../lib/init/getEnv";
import type { FastifyInstance } from "fastify";

export function registerDevelopmentCors(
  app: FastifyInstance,
  nodeEnv: string | undefined,
): void {
  if (nodeEnv !== "production") {
    app.register(cors, {
      origin: getEnv("client_url"),
      credentials: true,
    });
  }
}
