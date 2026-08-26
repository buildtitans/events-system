import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { IApplicationAPI } from "../service/applicationApi";
import type { ISessionHandler } from "../service/handlers/session/SessionHandler";

type FastifyReq = CreateFastifyContextOptions["req"];
type FastifyRes = CreateFastifyContextOptions["res"];

interface TRPCContext {
  req: FastifyReq;
  res: FastifyRes;
  session: ISessionHandler;
  api: IApplicationAPI;
}

export type { TRPCContext };
