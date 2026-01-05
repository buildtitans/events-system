import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
export function createContext(
    opts: CreateFastifyContextOptions
) {
    const { req, res } = opts;

    return {
        req,
        res
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
