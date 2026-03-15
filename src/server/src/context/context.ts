import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { Services } from "../service/services";
import { SessionHandler } from "../service/handlers/SessionHandler";

export function createContextInner(): { services: Services } {
  return { services: new Services() };
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
