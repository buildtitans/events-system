import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
import { buildServer } from "@/src/server/app";

const server = buildServer();

server.listen({
    port: 3001,
    host: "0.0.0.0"
}, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`Fastify Backend listening at ${address}`)
});

export { server };