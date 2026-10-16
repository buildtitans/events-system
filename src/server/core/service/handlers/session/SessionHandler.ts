import type { FastifyReply, FastifyRequest } from "fastify";
import type { StoredSession } from "../../../db/access/types/types";
import { PublicUserSchemaType } from "@/src/schemas/auth/userSchema";
import { UuidSchema } from "@/src/schemas/auth/uuidSchema";
import { validateOrThrow } from "../../../../../schemas/validateOrThrow";

declare const authenticatedUser: unique symbol;

export type AuthenticatedUserId = string & {
  readonly [authenticatedUser]: true;
};

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

    const userId = this.validateAndBrandUserId(id);

    this.reply.setCookie("session", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expires_at),
    });

    this.req.user = {
      id: userId,
    };
  }

  removeCookieHeader(): void {
    this.reply.clearCookie("session");
  }

  private validateAndBrandUserId(user_id: unknown): AuthenticatedUserId {
    const validUserId = validateOrThrow(UuidSchema, user_id);
    return validUserId as AuthenticatedUserId;
  }
}
