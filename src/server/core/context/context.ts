import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { IApplicationAPI } from "../service/applicationApi";
import { SessionHandler } from "@/src/server/core/service/handlers/session/SessionHandler";
import { TRPCContext } from "@/src/server/core/context/types";

export function createContext(
  { req, res }: CreateFastifyContextOptions,
  api: IApplicationAPI,
): TRPCContext {
  return {
    req,
    res,
    api,
    session: new SessionHandler(req, res),
  };
}
