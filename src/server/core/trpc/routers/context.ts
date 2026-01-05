import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext(options: CreateFastifyContextOptions) {
    const { req, res } = options;

    return { req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
