import type { FastifyInstance } from "fastify";

export async function registerSessionHook(app: FastifyInstance) {
    app.addHook("preHandler", async (req) => {
        const token = req.cookies.session;
        if (!token) return;

        const session = await app.db.auth.getSession(token);

        if (session) {
            req.user = { id: session.user_id };
        }
    });
}
