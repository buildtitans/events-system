import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
import { buildServer } from "@/src/server/core/main/app";
import { getEnv } from "@/src/server/core/lib/init/getEnv";

const server = buildServer();

const devHost = getEnv("dev_host");
const devPort = Number(getEnv("dev_fastify_port"));

server.listen(
  {
    port: devPort,
    host: devHost,
  },
  (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  },
);

export { server };
