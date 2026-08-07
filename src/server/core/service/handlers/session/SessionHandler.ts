import type { FastifyReply, FastifyRequest } from "fastify";
import type { StoredSession } from "../../../db/access/types/types";
import { PublicUserSchemaType } from "@/src/schemas/auth/userSchema";

export interface ISessionHandler {
  setCookieHeader(session: StoredSession, user: PublicUserSchemaType): void;
  removeCookieHeader(): void;
}

export class SessionHandler implements ISessionHandler {
  constructor(
    private readonly req: FastifyRequest,
    private readonly reply: FastifyReply,
  ) {}

  setCookieHeader(session: StoredSession, user: PublicUserSchemaType): void {
    const token = session.id;
    const { id } = user;

    this.reply.setCookie("session", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expires_at),
    });

    this.req.user = {
      id,
    };
  }

  removeCookieHeader(): void {
    this.reply.clearCookie("session");
  }
}
