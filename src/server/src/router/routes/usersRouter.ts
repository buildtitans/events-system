import { router, publicProcedure } from "@/src/server/src/context/init";

export const usersRouter = router({
  getUserEmail: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getEmailById(ctx.req.user?.id);
  }),

  userMemberships: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.getMemberships(
      ctx.req.user?.id,
    );
  }),

  rsvpsToEvents: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.participations.getRsvpdEvents(
      ctx.req.user?.id,
    );
  }),

  createdGroups: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.users.getGroupsCreated(
      ctx.req.user?.id,
    );
  }),
});
