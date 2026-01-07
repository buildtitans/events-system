import Fastify from 'fastify';
import { db } from './db';
import { eventsRoutes } from './routes/events.routes';
import { DBClient } from './db/dbClient';

function buildServer() {
    const app = Fastify({
        logger: true
    });

    app.decorate("db", new DBClient(db));
    app.register(eventsRoutes, { prefix: "/api" });

    return app;
}

export { buildServer };