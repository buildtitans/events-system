import "fastify";
import { DBClient } from "@/src/server/db/clients/dbClient";

declare module "fastify" {
    interface FastifyInstance {
        db: DBClient
    }
}