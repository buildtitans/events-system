import type { FastifyPluginAsync } from "fastify";

export const groupsRoutes: FastifyPluginAsync = async (app) => {

    const dbClient = app.db;

    app.get('/getGroups', async () => {

        const rows = await dbClient.getGroups();

        return {
            items: rows,
            meta: {
                total: rows.length
            }
        }
    })


}