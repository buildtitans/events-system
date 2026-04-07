"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionHandler = void 0;
class SessionHandler {
    req;
    reply;
    constructor(req, reply) {
        this.req = req;
        this.reply = reply;
    }
    setCookieHeader(session, user) {
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
exports.SessionHandler = SessionHandler;
//# sourceMappingURL=SessionHandler.js.map