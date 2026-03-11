import { DBClient } from "../db";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { buildAuthContext } from "./buildRequestContext";
import type { ContextCacheType, RBACMethods } from "./types";
import { ServiceClient } from "../services/serviceClient";
import { buildCache } from "./buildCache";

export type Context = {
  api: DBClient;
  user: FastifyRequest["user"] | null;
  reply: FastifyReply;
  req: FastifyRequest;
  auth: RBACMethods;
  services: ServiceClient;
  cache: ContextCacheType;
};

export async function createContext({
  req,
  res,
}: CreateFastifyContextOptions): Promise<Context> {
  const api = req.server.db;
  const user = req.user;
  const user_id = user?.id ?? null;

  return {
    api: req.server.db,
    user: user,
    reply: res,
    req: req,
    auth: await buildAuthContext(user),
    services: new ServiceClient(api),
    cache: await buildCache(api, user_id),
  };
}
