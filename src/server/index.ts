import { buildServer } from "./app";
import { getEvents } from "./endpoints/getEvents";

const server = buildServer();

server.get('/health', async () => {
    return { ok: true }
});

server.get('/api/events', getEvents);


server.listen({ port: 3001 }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`Fastify BFF listening at ${address}`)
});

export { server };