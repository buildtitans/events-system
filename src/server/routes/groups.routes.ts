import { GroupSchemaType } from "@/src/schemas/groupSchema";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

export const groupsRoutes: FastifyPluginAsync = async (app) => {

    const dbClient = app.db;

    app.get('/getGroups', async () => {

        const rows = await dbClient.groups.getGroups();

        return {
            items: rows,
            meta: {
                total: rows.length
            }
        }
    })

    app.post('/createGroup', async (
        req: FastifyRequest<{ Body: GroupSchemaType }>,
        reply: FastifyReply) => {

        const token = req.cookies.session;
        const isAuthenticated = await dbClient.auth.authenticate(token ?? ""); // TODO: tighten this

        if (!isAuthenticated) {
            return {
                group: null,
                meta: {
                    error: "unauthorized",
                    message: "Sign up to create a new group"
                }
            }
        }

        const group = await dbClient.groups.createGroup(req.body);

        return {
            group: group,
            meta: {
                error: null,
                message: `New group — ${group?.name} created on ${group?.created_at}`
            }
        }

    })

}