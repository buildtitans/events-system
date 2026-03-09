import { DBClient } from "../db";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { buildRequestContext } from "./buildRequestContext";
import type { ContextCacheType, RBACMethods, ServicesType } from "./types";

export type Context = {
  api: DBClient;
  user: FastifyRequest["user"] | null;
  reply: FastifyReply;
  req: FastifyRequest;
  auth: RBACMethods;
  services: ServicesType;
  cache: ContextCacheType;
};

export async function createContext({
  req,
  res,
}: CreateFastifyContextOptions): Promise<Context> {
  const api = req.server.db;
  const user = req.user;
  const bootstrap = await buildRequestContext(api, user);

  return {
    api: api,
    user: user,
    reply: res,
    req: req,
    auth: bootstrap.rbac,
    services: bootstrap.services,
    cache: bootstrap.cache,
  };
}
