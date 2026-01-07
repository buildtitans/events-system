import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

const requireApi = t.middleware(({ ctx, next }) => {
    if (!ctx.api) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ctx.api missing from context"
        });
    }
    return next({
        ctx
    });
});

const protectedProcedure = t.procedure.use(requireApi);

export {
    protectedProcedure,
    publicProcedure,
    router
}