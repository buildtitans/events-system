import "fastify";

type AuthenticatedUser = {
  id: string;
} | null;

declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser;
  }
}
