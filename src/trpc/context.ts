import { EventsClient } from "./clients/createEventsClient";

export type Context = {
    eventsClient: EventsClient;
};

export function createContext(req: Request): Context {
    const baseUrl = process.env.FASTIFY_SERVER_URL ?? "http://localhost:3001"
    return {
        eventsClient: new EventsClient(baseUrl, "/api/events"),
    };
}