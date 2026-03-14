import "fastify";
import { DBClient } from "@/src/server/src/db";
import { ServiceClient } from "../service/services";

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
    services: ServiceClient | null;
  }
}
