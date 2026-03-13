import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

type SignUpBody = {
  email: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

type UserParams = {
  userId: string;
};

function getSessionToken(req: FastifyRequest): string | undefined {
  const cookieToken = req.cookies?.session_token;
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  return undefined;
}

export async function authRoutes(app: FastifyInstance) {
  // GET /auth/me
  // Resolve current user from session token
  app.get("/auth/me", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = getSessionToken(req);

      if (!token) {
        return reply.code(200).send({ user: null });
      }

      const user = await app.db.auth.authenticate(token);

      return reply.code(200).send({ user });
    } catch (error) {
      app.log.error({ error }, "Failed to authenticate current user");
      return reply.code(500).send({ error: "Failed to resolve current user" });
    }
  });

  // POST /auth/signup
  app.post(
    "/auth/signup",
    async (req: FastifyRequest<{ Body: SignUpBody }>, reply: FastifyReply) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return reply
            .code(400)
            .send({ error: "Email and password are required" });
        }

        const user = await app.db.auth.signUp(email, password);

        return reply.code(201).send({ user });
      } catch (error) {
        app.log.error({ error }, "Failed to sign up user");
        return reply.code(500).send({ error: "Failed to sign up user" });
      }
    },
  );

  // POST /auth/login
  app.post(
    "/auth/login",
    async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return reply
            .code(400)
            .send({ error: "Email and password are required" });
        }

        const result = await app.db.auth.login(email, password);

        reply.setCookie("session_token", result.session.id, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          expires: result.session.expires_at,
          secure: process.env.NODE_ENV === "production",
        });

        return reply.code(200).send({
          user: result.user,
        });
      } catch (error) {
        app.log.error({ error }, "Failed to log in user");
        return reply.code(401).send({ error: "Invalid email or password" });
      }
    },
  );

  // POST /auth/logout
  app.post("/auth/logout", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = getSessionToken(req);

      if (!token) {
        reply.clearCookie("session_token", {
          path: "/",
        });

        return reply.code(200).send({ success: true });
      }

      const success = await app.db.auth.logOut(token);

      reply.clearCookie("session_token", {
        path: "/",
      });

      return reply.code(200).send({ success });
    } catch (error) {
      app.log.error({ error }, "Failed to log out user");
      return reply.code(500).send({ error: "Failed to log out user" });
    }
  });

  // OPTIONAL: GET /auth/:userId/email
  // Keep this protected or internal-only if you expose it at all
  app.get<{ Params: UserParams }>("/auth/:userId/email", async (req, reply) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return reply.code(400).send({ error: "Invalid user id" });
      }

      const result = await app.db.auth.getEmailByUserId(userId);

      return reply.code(200).send(result);
    } catch (error) {
      app.log.error({ error }, "Failed to fetch email by user id");
      return reply
        .code(500)
        .send({ error: "Failed to fetch email for this user" });
    }
  });
}
