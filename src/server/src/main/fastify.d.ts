import "fastify";
import { DBClient } from "@/src/server/src/db";

declare module "fastify" {
    interface FastifyInstance {
        db: DBClient,
    }

    interface FastifyRequest {
        user?: {
            id: string,
            role: "user"
        }
    }
}