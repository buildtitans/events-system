import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { Services } from "../service/services";
import { SessionHandler } from "../service/handlers/SessionHandler";

export type InnerContext = {
  service: Services;
};

export function createContextInner(): InnerContext {
  return {
    service: new Services(),
  };
}

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const innerContext = createContextInner();

  return {
    req,
    res,
    session: new SessionHandler(req, res),
    ...innerContext,
  };
}

export type Context = ReturnType<typeof createContext>;
