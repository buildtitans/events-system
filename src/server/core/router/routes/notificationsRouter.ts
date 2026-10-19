import { validateRouterInput } from "../adaptors/validateRouterInput";
import {
  CreateNotificationSchema,
  NotificationIdsSchema,
} from "@/src/schemas/notifications/notificationsSchema";
import { router, protectedProcedure } from "@/src/server/core/context/init";

const selectNotificationRouter = router({
  newAndViewed: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.notifications.getNotifications(
      ctx.req.user?.id,
    );
  }),
});

const writeNotificationRouter = router({
  create: protectedProcedure
    .input(validateRouterInput(CreateNotificationSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.notifications.createNotification(
        input,
        ctx.req.user?.id,
      );
    }),

  markOpened: protectedProcedure
    .input(validateRouterInput(NotificationIdsSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.notifications.markSeen(
        ctx.req.user?.id,
        input,
      );
    }),
});

export const notificationRouter = router({
  select: selectNotificationRouter,
  write: writeNotificationRouter,
});

export type NotificatonsRouter = typeof notificationRouter;
