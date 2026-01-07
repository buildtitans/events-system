import Fastify from 'fastify';
import { db } from './db';
import { eventsRoutes } from './routes/events.routes';

function buildServer() {
    const app = Fastify({
        logger: true
    });

    app.decorate("db", db)
    app.register(eventsRoutes, { prefix: "/api" });

    return app;
}

export { buildServer };