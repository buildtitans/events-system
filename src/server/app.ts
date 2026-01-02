import Fastify from 'fastify';

function buildServer() {
    const app = Fastify({
        logger: true
    });
    return app;
}


export { buildServer };