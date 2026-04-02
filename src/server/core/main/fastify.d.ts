import "fastify";
import { DBClient } from "@/src/server/core/db";

type CachedUser = {
  id: string;
  role: "user";
  email: string;
} | null;

declare module "fastify" {
  interface FastifyInstance {
    db: DBClient;
  }

  interface FastifyRequest {
    user: CachedUser;
  }
}
