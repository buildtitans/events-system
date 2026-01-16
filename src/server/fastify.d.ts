import "fastify";
import { DBClient } from "@/src/server/db";

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