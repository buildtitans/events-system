import cors from "@fastify/cors";
import Fastify from 'fastify';
import fastifyCookie from "@fastify/cookie";
import {
    fastifyTRPCPlugin,
    FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import {
    db,
    DBClient
} from '@/src/server/db';
import { getEnv } from '../lib/utils/getEnv';
import { registerSessionHook } from './hooks/registerSessionHook';
import { type AppRouter, appRouter } from "../trpc/router";
import { createContext } from "../trpc/context";

function buildServer() {
    const app = Fastify({
        logger: true,
        maxParamLength: 500
    });
    app.register(cors, {
        origin: "http://localhost:3000",
        credentials: true,
    });

    const cookie_secret = getEnv("cookies_secret");

    app.decorate("db", new DBClient(db));
    app.register(fastifyCookie, {
        secret: cookie_secret
    })
    registerSessionHook(app);

    app.register(fastifyTRPCPlugin, {
        prefix: "/trpc",
        trpcOptions: {
            router: appRouter,
            createContext,
            onError({ path, error }) {
                console.error(`Error in tRPC handler on path ${path} — ${error}`)
            }
        } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions']
    })

    return app;
}

export { buildServer };