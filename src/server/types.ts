import "fastify";
import { DBClient } from "./db/dbClient";

declare module "fastify" {
    interface FastifyInstance {
        db: DBClient
    }
}