import type { FastifyServerOptions } from "fastify";

export function createLoggerOptions(
  nodeEnv: string | undefined,
): FastifyServerOptions["logger"] {
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

  if (nodeEnv === "production") {
    return { serializers };
  }

  return {
    transport: {
      target: "pino-pretty",
    },
    serializers,
  };
}
