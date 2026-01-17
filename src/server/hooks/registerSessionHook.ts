import type { FastifyInstance } from "fastify";

export async function registerSessionHook(app: FastifyInstance) {
    app.addHook("preHandler", async (req) => {
        const token = req.cookies.session;
        if (!token) {
            console.error("*************** NO COOKIE FOR REQUEST FOUND ************************");
            return;
        };

        const validated_user = await app.db.auth.authenticate(token);

        if (validated_user) {
            req.user = { id: validated_user.id, role: "user" };
        }
    });
}
