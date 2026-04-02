import type { FastifyReply, FastifyRequest } from "fastify";
import type { StoredSession } from "../../db/clients/types/types";
import { PublicUserSchemaType } from "@/src/schemas/auth/userSchema";

export class SessionHandler {
  constructor(
    private readonly req: FastifyRequest,
    private readonly reply: FastifyReply,
  ) {}

  setCookieHeader(session: StoredSession, user: PublicUserSchemaType) {
    const token = session.id;

    this.reply.setCookie("session", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expires_at),
    });

    this.req.user = {
      id: user.id,
      email: user.email,
      role: "user",
    };
  }

  removeCookieHeader() {
    this.reply.clearCookie("session");
  }
}
