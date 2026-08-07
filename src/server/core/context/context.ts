import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { AppServices } from "@/src/server/core/service/appServices";
import { SessionHandler } from "@/src/server/core/service/handlers/session/SessionHandler";
import { TRPCContext, InnerContext } from "@/src/server/core/context/types";

export function createContext({
  req,
  res,
}: CreateFastifyContextOptions): TRPCContext {
  return {
    req,
    res,
    session: new SessionHandler(req, res),
    ...createContextInner(),
  };
}

export function createContextInner(): InnerContext {
  return { services: new AppServices() };
}
