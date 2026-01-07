import type { FastifyPluginAsync } from "fastify";
import { listEvents } from "../services/getEvents";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
    app.get("/events", async () => {
        const rows = await listEvents(app.db);
        return { items: rows, meta: { total: rows.length } };
    });
};
