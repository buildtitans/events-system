import { NewGroupInputSchemaType } from "@/src/schemas/groupSchema";
import type { FastifyPluginAsync, FastifyRequest } from "fastify";

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
        req: FastifyRequest<
            { Body: NewGroupInputSchemaType }
        >
    ) => {

        const token = req.cookies.session;

        if (!token) {
            return {
                group: null,
                meta: {
                    error: "unauthorized",
                    message: "Sign up to create a new group"
                }
            }
        }
        const user = await dbClient.auth.getSession(token);

        if (!user) return {
            group: null,
            meta: {
                error: "unauthorized",
                message: "Sign up to create a new group"
            }
        }

        const group = await dbClient.groups.createGroup(req.body, user?.user_id);

        return {
            group: group,
            meta: {
                error: null,
                message: `New group — ${group?.name} created on ${group?.created_at}`
            }
        };
    })
};