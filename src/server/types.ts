import "fastify";
import type { Kysely } from "kysely";
import type { DB } from "./db/types";


declare module "fastify" {
    interface FastifyInstance {
        db: Kysely<DB>
    }
}