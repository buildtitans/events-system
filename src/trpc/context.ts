import { FastifyRequest } from "fastify";
import { getEnv } from "../lib/utils/getEnv";
import { FastifyApiClient } from "./clients/createFastifyApiClient";

export type Context = {
    api: FastifyApiClient,
};

export function createContext(req: Request): Context {
    const baseUrl = getEnv("fastifyUrl");
    return {
        api: new FastifyApiClient(baseUrl)
    };
}