import type { NextRequest } from "next/server";
import { createFastifyClient } from "./clients/fastify";

export type Context = {
    api: ReturnType<typeof createFastifyClient>;
};

export function createContext(req: NextRequest): Context {
    const baseUrl = process.env.FASTIFY_BASE_URL ?? "http://localhost:3001";

    return {
        api: createFastifyClient(baseUrl),
    };
}
