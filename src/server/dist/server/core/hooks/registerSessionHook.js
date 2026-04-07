"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerContextHook = registerContextHook;
async function detectSession(app, req) {
    try {
        const token = req.cookies.session;
        const user = await app.db.auth.authenticate(token);
        if (user) {
            req.user = {
                id: user.id,
                role: "user",
                email: user.email,
            };
        }
        else {
            req.user = null;
        }
    }
    catch (err) {
        app.log.error({ err }, "Session authentication failed");
    }
}
async function registerContextHook(app) {
    app.addHook("onRequest", async (req) => {
        await detectSession(app, req);
    });
}
//# sourceMappingURL=registerSessionHook.js.map