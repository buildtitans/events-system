import {
  router,
  publicProcedure,
  protectedProcedure,
} from "@/src/server/src/context/init";
import {
  createNotificationInput,
  SeenNotificationsInputValidator,
} from "@/src/schemas/notifications/notificationsSchema";

export const notificationsRouter = router({
  getNotifications: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.notifications.getNewNotifications(
      ctx.req.user?.id,
    );
  }),

  createNotification: publicProcedure
    .input(createNotificationInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.notifications.createNotification(
        input,
      );
    }),

  markOpenedNotifications: publicProcedure
    .input(SeenNotificationsInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.notifications.markSeen(
        ctx.req.user?.id,
        input,
      );
    }),
});

export type NotificatonsRouter = typeof notificationsRouter;
