import { EventsClient } from "./clients/createEventsClient";

export type Context = {
    eventsClient: EventsClient;
};

export function createContext(req: Request): Context {
    const baseUrl = "http://localhost:3001";
    const dockerUrl = "http://host.docker.internal:3001";
    return {
        eventsClient: new EventsClient("http://fastify:3001", "/api/events"),
    };
}