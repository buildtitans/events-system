import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
import { buildServer } from "@/src/server/src/main/app";
import { getEnv } from "@/src/server/src/lib/init/getEnv";

const server = buildServer();

const devPort = getEnv("dev_host");

server.listen({
    port: 3001,
    host: devPort
}, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});

export { server };