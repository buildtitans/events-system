import type { FastifyPluginAsync } from "fastify";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
    const dbClient = app.db
    app.get("/events", async () => {

        const rows = await dbClient.getEvents();
        return { items: rows, meta: { total: rows.length } };
    });

    app.get("/groups", async () => {
        const rows = await dbClient.getGroups();

        return {
            items: rows,
            meta: {
                total: rows.length
            }
        }
    })


};