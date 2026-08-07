import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { IAppServices } from "../service/appServices";
import type { ISessionHandler } from "../service/handlers/session/SessionHandler";

type FastifyReq = CreateFastifyContextOptions["req"];
type FastifyRes = CreateFastifyContextOptions["res"];

type InnerContext = { services: IAppServices };

interface TRPCContext {
  req: FastifyReq;
  res: FastifyRes;
  session: ISessionHandler;
  services: IAppServices;
}

export type { TRPCContext, InnerContext };
