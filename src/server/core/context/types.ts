import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { ApplicationAPI } from "../service/applicationApi";
import type { ISessionHandler } from "../service/handlers/session/SessionHandler";

type FastifyReq = CreateFastifyContextOptions["req"];
type FastifyRes = CreateFastifyContextOptions["res"];

type InnerContext = { api: ApplicationAPI };

interface TRPCContext {
  req: FastifyReq;
  res: FastifyRes;
  session: ISessionHandler;
  api: InnerContext["api"];
}

export type { TRPCContext, InnerContext };
