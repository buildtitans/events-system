import { DBClient } from "../../server/db";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

export type Context = {
    api: DBClient,
    user: FastifyRequest["user"] | null,
    reply: FastifyReply,
    req: FastifyRequest
};

export function createContext({
    req,
    res
}: CreateFastifyContextOptions): Context {
    return {
        api: req.server.db,
        user: req.user ?? null,
        reply: res,
        req: req
    };
}