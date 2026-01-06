import Fastify from 'fastify';
import { db } from './db';

function buildServer() {
    const app = Fastify({
        logger: true
    });

    app.decorate("db", db)

    return app;
}

export { buildServer };