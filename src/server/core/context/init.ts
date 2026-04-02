import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.req.user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required to access this resource",
    });
  }
  return next({
    ctx,
  });
});

const protectedProcedure = t.procedure.use(requireAuth);

export { protectedProcedure, publicProcedure, router };
