import { DBClient } from "../db";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { buildRbacContext } from "./buildRbacContext";
import type { RBACContextType } from "./buildRbacContext";

export type Context = {
  api: DBClient;
  user: FastifyRequest["user"] | null;
  reply: FastifyReply;
  req: FastifyRequest;
  auth: RBACContextType;
};

export async function createContext({
  req,
  res,
}: CreateFastifyContextOptions): Promise<Context> {
  const api = req.server.db;
  const user = req?.user ?? null;
  const rbac = await buildRbacContext(api, user);

  return {
    api: req.server.db,
    user: req.user ?? null,
    reply: res,
    req: req,
    auth: rbac,
  };
}
