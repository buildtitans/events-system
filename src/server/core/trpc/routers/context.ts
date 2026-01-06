import type { Kysely } from 'kysely';
import type { DB } from '@/src/server/db/types';
import { FastifyRequest } from 'fastify';

export type Context = {
    db: Kysely<DB>,
}

export function createContext({ req }: { req: FastifyRequest }): Context {
    return {
        db: req.server.db,
    }
}
