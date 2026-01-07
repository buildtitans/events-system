import { createFastifyClient } from "./clients/fastify";

export type Context = {
    api: ReturnType<typeof createFastifyClient>;
};

export function createContext(req: Request): Context {
    const baseUrl = "http://localhost:3001";

    return {
        api: createFastifyClient(baseUrl),
    };
}
