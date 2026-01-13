import type { FastifyPluginAsync } from "fastify";
import { compileEventsLayout } from "@/src/server/layout/compileEventsLayout";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
    const dbClient = app.db
    app.get("/events", async () => {
        const rows = await dbClient.getEvents();
        const layout = compileEventsLayout(rows);

        return {
            items: layout,
            meta: {
                total: layout.length
            }
        };
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