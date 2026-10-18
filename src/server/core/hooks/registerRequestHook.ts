import type { FastifyInstance, FastifyRequest } from "fastify";
import type { IDBClient } from "../db/access/client/dbClient";
import type { AuthenticatedUserId } from "../service/handlers/session/SessionHandler";
import type { AuthenticatedUser } from "../main/fastify";

function toAuthenticatedUser(
  user: { email: string; id: string } | null,
): AuthenticatedUser | undefined {
  if (user?.id) {
    return { id: user.id as AuthenticatedUserId };
  } else {
    return undefined;
  }
}

async function detectSession(
  app: FastifyInstance,
  req: FastifyRequest,
  db: IDBClient,
): Promise<void> {
  try {
    const token = req.cookies.session;
    const user = await db.auth.authenticate(token);
    req.user = toAuthenticatedUser(user);
  } catch (err) {
    req.user = undefined;
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
