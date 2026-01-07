import { createGetEventsClient } from "./clients/createGetEventsClient";

export type Context = {
    api: ReturnType<typeof createGetEventsClient>;
};

export function createContext(req: Request): Context {
    const baseUrl = "http://localhost:3001";

    return {
        api: createGetEventsClient(baseUrl),
    };
}
