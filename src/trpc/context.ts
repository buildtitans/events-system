import { EventsClient } from "./clients/createEventsClient";

export type Context = {
    eventsClient: EventsClient;
};

export function createContext(req: Request): Context {
    const baseUrl = process.env.FASTIFY_BASE_URL ?? "http://fastify:3001"
    return {
        eventsClient: new EventsClient(baseUrl, "/api/events"),
    };
}