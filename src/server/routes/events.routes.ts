import type { FastifyPluginAsync } from "fastify";

export const eventsRoutes: FastifyPluginAsync = async (app) => {

    app.get("/events", async () => {
        const dbClient = app.db
        const rows = await dbClient.getEvents();
        return { items: rows, meta: { total: rows.length } };
    });
};