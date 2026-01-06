import { buildServer } from "./app";
import { listEvents } from "./services/getEvents";

const server = buildServer();

server.get('/health', async () => {
    return { ok: true }
});

server.get('/api/events', listEvents);


server.listen({ port: 3001 }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`Fastify BFF listening at ${address}`)
});

export { server };