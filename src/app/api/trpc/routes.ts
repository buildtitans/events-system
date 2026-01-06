import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";
import { eventsRouter } from "@/src/trpc/routers/eventsRouter";
import { createContext } from "@/src/trpc/context";

function handler(req: NextRequest) {
    return fetchRequestHandler({
        endpoint: "api/trpc",
        req,
        router: eventsRouter,
        createContext: () => createContext(req)
    })
}

export { handler as GET, handler as POST };