export class SessionProxyHandler {
  constructor(private res: Response) {}

  setSessionCookie(token: string, expires: number) {
    const cookie = this.buildSessionCookie(token, expires);

    this.res.headers.append("Set-Cookie", cookie);
  }

  buildSessionCookie(token: string, expiresAt: number) {
    const expires = new Date(expiresAt).toUTCString();

    return [
      `session_token=${token}`,
      `HttpOnly`,
      `Path=/`,
      `SameSite=Lax`,
      `Expires=${expires}`,
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ");
  }
}
