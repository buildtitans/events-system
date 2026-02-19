import cors from "@fastify/cors";
import Fastify from 'fastify';
import fastifyCookie from "@fastify/cookie";
import { registerSessionHook } from './hooks/registerSessionHook';
import { createContext } from "@/src/trpc/context";
import {
    fastifyTRPCPlugin,
    FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import {
    db,
    DBClient
} from '@/src/server/db';
import {
    type AppRouter,
    appRouter
} from "@/src/trpc/router";
import { getEnv } from "../lib/utils/init/getEnv";



function buildServer() {
    const client_url = getEnv("client_url");

    const app = Fastify({
        logger: true,
        routerOptions: {
            maxParamLength: 500
        }
    });
    app.register(cors, {
        origin: client_url,
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