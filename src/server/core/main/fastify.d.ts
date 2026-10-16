import "fastify";
import { AuthenticatedUserId } from "../service/handlers/session/SessionHandler";

export type AuthenticatedUser = {
  id: AuthenticatedUserId;
};

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}
