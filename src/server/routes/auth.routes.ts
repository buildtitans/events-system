import type { FastifyPluginAsync, FastifyReply } from "fastify";
import type { FastifyRequest } from "fastify";

type LoginBody = {
    input_email: string,
    input_password: string
}

export const authRoutes: FastifyPluginAsync = async (app) => {

    const dbClient = app.db;

    app.post('/login', async (
        req: FastifyRequest<{ Body: LoginBody }>,
        reply: FastifyReply
    ) => {
        const { input_email, input_password } = req.body;
        const { user, session } = await dbClient.auth.login(input_email, input_password);

        reply.setCookie("session", session.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: session.expires_at,
        });

        return {
            user
        }
    })

}

