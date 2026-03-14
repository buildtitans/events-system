import type { FastifyInstance, FastifyRequest } from "fastify";
import { ServiceClient } from "../service/services";

async function detectSession(
  app: FastifyInstance,
  req: FastifyRequest,
): Promise<void> {
  try {
    const token = req.cookies.session;

    const user = await app.db.auth.authenticate(token);

    if (user) {
      req.user = {
        id: user.id,
        role: "user",
        email: user.email,
      };
    } else {
      req.user = null;
    }
  } catch (err) {
    app.log.error({ err }, "Session authentication failed");
  }
}

export async function registerContextHook(app: FastifyInstance) {
  app.addHook("preHandler", async (req: FastifyRequest) => {
    await detectSession(app, req);

    req.services = new ServiceClient(req.server.db);
  });
}
