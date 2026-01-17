//import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
//import { createContext } from "@/src/trpc/context";
//import { appRouter } from "@/src/trpc/router";
//
//function handler(req: Request) {
//    return fetchRequestHandler({
//        endpoint: "/api/trpc",
//        req,
//        router: appRouter,
//        createContext: () => createContext(req)
//    })
//}
//
//export const POST = handler;
