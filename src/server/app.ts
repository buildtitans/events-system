import Fastify from 'fastify';
import { eventsRoutes } from '@/src/server/routes/events.routes';
import {
    db,
    DBClient
} from '@/src/server/db';

function buildServer() {
    const app = Fastify({
        logger: true
    });

    app.decorate("db", new DBClient(db));
    app.register(eventsRoutes, { prefix: "/api" });

    return app;
}

export { buildServer };