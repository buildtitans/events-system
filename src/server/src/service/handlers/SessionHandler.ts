import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthClientLoginResponse } from "../../db/clients/types/types";

export class SessionHandler {
  constructor(
    private readonly req: FastifyRequest,
    private readonly reply: FastifyReply,
  ) {}

  setCookieHeader(result: AuthClientLoginResponse) {
    const token = result.session.id;

    this.reply.setCookie("session", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(result.session.expires_at),
    });

    this.req.user = {
      id: result.user.id,
      email: result.user.email,
      role: "user",
    };
  }

  removeCookieHeader() {
    this.reply.clearCookie("session");
  }
}
