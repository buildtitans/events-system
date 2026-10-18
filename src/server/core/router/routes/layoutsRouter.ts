import { router, publicProcedure } from "@/src/server/core/context/init";
import {
  groupIdInputValidator,
  groupsByCategoryInputValidator,
} from "../inputValidators/inputValidation";
import { EventIdInputValidator } from "../inputValidators/inputValidation";

const groupLayoutsRouter = router({
  discovery: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.groups.query.discovery();
  }),
  byCategory: publicProcedure
    .input(groupsByCategoryInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.groups.query.byCategory(input);
    }),

  popular: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.participations.census.getPopularGroups();
  }),
});

const eventLayoutRouter = router({
  discovery: publicProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.events.layout.discovery();
  }),
  byIds: publicProcedure
    .input(EventIdInputValidator)
    .query(async ({ ctx, input }) => {
      return await ctx.api.services.domains.events.layout.byIds(input);
    }),
  forGroup: publicProcedure
    .input(groupIdInputValidator)
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

export const layoutRouter = router({
  groups: groupLayoutsRouter,
  events: eventLayoutRouter,
});
