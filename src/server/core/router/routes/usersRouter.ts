import { router, protectedProcedure } from "@/src/server/core/context/init";

export const userRouter = router({
  email: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.users.select.email(ctx.req.user?.id);
  }),

  memberships: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.users.select.memberships(
      ctx.req.user?.id,
    );
  }),

  rsvps: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.users.select.rsvps(ctx.req.user?.id);
  }),

  createdGroups: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.users.select.groups(ctx.req.user?.id);
  }),
});
