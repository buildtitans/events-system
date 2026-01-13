import type { FastifyPluginAsync } from "fastify";
import { compileEventsLayout } from "@/src/server/layout/compileEventsLayout";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
    const dbClient = app.db
    app.get("/getEvents", async () => {
        const rows = await dbClient.getEvents();
        const layout = compileEventsLayout(rows);

        return {
            items: layout,
            meta: {
                total: layout.length
            }
        };
    });

};