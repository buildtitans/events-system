import { validateRouterInput } from "@/src/server/core/router/adaptors/validateRouterInput";
import { GroupIDForInsertSchema } from "@/src/schemas/groups/groupMembersSchema";
import { EventIdSchema } from "@/src/schemas/events/eventAttendantsSchema";
import { router, publicProcedure } from "@/src/server/core/context/init";

const eventLayoutRouter = router({
  discovery: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.events.layout.discovery();
  }),
  forGroup: publicProcedure
    .input(validateRouterInput(GroupIDForInsertSchema))
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.layout.forGroup(input);
    }),
  popular: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.events.layout.popular();
  }),
  upcoming: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.events.layout.upcoming();
  }),
});

export const hydrateEventsRouter = router({
  single: publicProcedure
    .input(validateRouterInput(EventIdSchema))
    .query(async ({ ctx, input }) => {
      const userId = ctx.req.user?.id;
      return await ctx.api.services.domains.events.query.hydrate(input, userId);
    }),
  layouts: eventLayoutRouter,
});
