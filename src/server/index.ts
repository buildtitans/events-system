import { buildServer } from "@/src/server/core/main/app";
import { getEnv } from "@/src/server/core/lib/init/getEnv";

const server = buildServer();
const prodPort = Number(getEnv("fastifyPort"));
const prodHost = getEnv("fastifyHost");

server.listen(
  {
    port: prodPort,
    host: prodHost,
  },
  (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  },
);

export { server };
