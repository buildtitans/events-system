import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import type { TRPCContext } from "./types";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

const requireAuth = t.middleware(({ ctx, next }) => {
  const authenticatedUser = ctx.req.user;

  if (!authenticatedUser?.id) {
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
