import { router, protectedProcedure } from "@/src/server/core/context/init";
import {
  createNotificationInput,
  SeenNotificationsInput,
} from "../inputValidators/inputValidation";

const selectNotificationRouter = router({
  new: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.notifications.getNewNotifications(
      ctx.req.user?.id,
    );
  }),
  newAndViewed: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.api.services.domains.notifications.getNotifications(
      ctx.req.user?.id,
    );
  }),
});

const writeNotificationRouter = router({
  create: protectedProcedure
    .input(createNotificationInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.services.domains.notifications.createNotification(
        input,
        ctx.req.user?.id,
      );
    }),

  markOpened: protectedProcedure
    .input(SeenNotificationsInput)
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
