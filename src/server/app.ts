import Fastify from 'fastify';
import { db } from '@/src/server/db/db';
import { eventsRoutes } from '@/src/server/routes/events.routes';
import { DBClient } from '@/src/server/db/clients/dbClient';

function buildServer() {
    const app = Fastify({
        logger: true
    });

    app.decorate("db", new DBClient(db));
    app.register(eventsRoutes, { prefix: "/api" });

    return app;
}

export { buildServer };