import type { FastifyInstance, FastifyRequest } from "fastify";
import type { IDBClient } from "../db/access/client/dbClient";

async function detectSession(
  app: FastifyInstance,
  req: FastifyRequest,
  db: IDBClient,
): Promise<void> {
  try {
    const token = req.cookies.session;
    const user = await db.auth.authenticate(token);
    req.user = user ? { id: user.id } : null;
  } catch (err) {
    req.user = null;
    app.log.error({ err }, "Session authentication failed");
  }
}

export function registerRequestHook({
  app,
  db,
}: {
  app: FastifyInstance;
  db: IDBClient;
}) {
  app.addHook("onRequest", async (req: FastifyRequest) => {
    await detectSession(app, req, db);
  });
}
