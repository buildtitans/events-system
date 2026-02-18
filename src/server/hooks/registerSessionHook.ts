import type { FastifyInstance } from "fastify";

export async function registerSessionHook(app: FastifyInstance) {
    app.addHook("preHandler", async (req) => {
        req.user = undefined;

        try {
            const token = req.cookies.session;

            if (!token) return;

            const validated_user = await app.db.auth.authenticate(token);

            if (!validated_user) return;

            req.user = { id: validated_user.id, role: "user" };

        } catch (err) {

            app.log.error({ err }, "Session authentication failed");
        }
    });
}
