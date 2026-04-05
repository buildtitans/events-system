import { router, protectedProcedure } from "@/src/server/core/context/init";
import {
  createNotificationInput,
  NotificationArrayInputValidator,
} from "@/src/schemas/notifications/notificationsSchema";

export const notificationsRouter = router({
  getNotifications: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.notifications.getNewNotifications(
      ctx.req.user?.id,
    );
  }),

  createNotification: protectedProcedure
    .input(createNotificationInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.notifications.createNotification(
        input,
        ctx.req.user?.id,
      );
    }),

  markOpenedNotifications: protectedProcedure
    .input(NotificationArrayInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.notifications.markSeen(
        ctx.req.user?.id,
        input,
      );
    }),
});

export type NotificatonsRouter = typeof notificationsRouter;
