import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { AppServices } from "../service/appServices";
import { SessionHandler } from "../service/handlers/SessionHandler";

export function createContextInner(): { services: AppServices } {
  return { services: new AppServices() };
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
