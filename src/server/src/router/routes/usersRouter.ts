import { router, publicProcedure } from "@/src/server/src/context/init";

export const usersRouter = router({
  getUserEmail: publicProcedure.mutation(async ({ ctx }) => {
    const context = await ctx;

    return await context.service.api.userClient.getEmailById(
      context.req.user?.id,
    );
  }),

  userMemberships: publicProcedure.mutation(async ({ ctx }) => {
    const context = await ctx;

    const memberships = await context.service.api.participations.getMemberships(
      context.req.user?.id,
    );

    const groupIds = memberships.map((membership) => membership.group_id);

    const nextGroupEventLookup =
      await context.service.api.participations.getNextEventLookupMap(groupIds);

    return {
      memberships: memberships,
      nextGroupEventLookup: nextGroupEventLookup,
    };
  }),

  rsvpsToEvents: publicProcedure.mutation(async ({ ctx }) => {
    const context = await ctx;

    return context.service.api.participations.getRsvpdEvents(
      context.req.user?.id,
    );
  }),

  createdGroups: publicProcedure.mutation(async ({ ctx }) => {
    const context = await ctx;

    return await context.service.api.userClient.getGroupsCreated(
      context.req.user?.id,
    );
  }),
});
