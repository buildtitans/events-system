import { router, publicProcedure } from "@/src/server/src/bootstrap/init";
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";

export const usersRouter = router({
  getUserEmail: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCResolverError(403, "Permission to access user data denied");
    }

    return ctx.services.getEmailById(ctx.user?.id);
  }),

  userMemberships: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.cache.roleLookupMap;
  }),
  rsvpsToEvents: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCResolverError(403, "Permission to access user data denied");
    }

    return ctx.cache.attendanceDictionary;
  }),

  createdGroups: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCResolverError(403, "Permission denied to access user data");
    }
    return await ctx.services.getGroupsCreated(ctx.user.id);
  }),
});
