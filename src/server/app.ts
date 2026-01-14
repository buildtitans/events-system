import Fastify from 'fastify';
import fastifyCookie from "@fastify/cookie";
import { eventsRoutes } from '@/src/server/routes/events.routes';
import { groupsRoutes } from './routes/groups.routes';
import {
    db,
    DBClient
} from '@/src/server/db';
import { getEnv } from '../lib/utils/getEnv';
import { registerSessionHook } from './hooks/registerSessionHook';
import { authRoutes } from './routes/auth.routes';

function buildServer() {
    const app = Fastify({
        logger: true
    });
    const cookie_secret = getEnv("cookies_secret");

    app.decorate("db", new DBClient(db));
    app.register(fastifyCookie, {
        secret: cookie_secret
    })
    registerSessionHook(app);
    app.register(eventsRoutes, { prefix: "/api/events" });
    app.register(groupsRoutes, { prefix: "/api/groups" });
    app.register(authRoutes, { prefix: '/api/auth' });
    return app;
}

export { buildServer };