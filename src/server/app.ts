import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { CORSForTrpcConfig, trpcPluginOptions } from './core/trpc/config/config';
import cors from '@fastify/cors';

function buildServer() {
    const app = Fastify({
        logger: true
    });

    app.register(cors, CORSForTrpcConfig);
    app.register(fastifyTRPCPlugin, trpcPluginOptions);

    return app;
}


export { buildServer };