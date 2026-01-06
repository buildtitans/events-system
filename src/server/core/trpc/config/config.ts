import type { FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import { appRouter, type TrpcAppRouter } from '../index';
import { createContext } from '../routers/context';

type CORSFastifyPluginConfig = {
    origin: string[],
    credentials: boolean
}

const trpcPluginOptions: FastifyTRPCPluginOptions<TrpcAppRouter> = {
    prefix: '/trpc',
    trpcOptions: {
        router: appRouter,
        createContext,
    }
};

const CORSForTrpcConfig: CORSFastifyPluginConfig = {
    origin: ['http://localhost:3000'],
    credentials: true
};

export { trpcPluginOptions, CORSForTrpcConfig };