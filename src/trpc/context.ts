import { EventsClient } from "./clients/createEventsClient";

export type Context = {
    eventsClient: EventsClient;
};

export function createContext(req: Request): Context {
    const serverUrl = "http://fastify:3001"
    return {
        eventsClient: new EventsClient(serverUrl, "/api/events"),
    };
}