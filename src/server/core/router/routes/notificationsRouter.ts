import { router, protectedProcedure } from "@/src/server/core/context/init";
import {
  createNotificationInput,
  NotificationArrayInputValidator,
} from "../inputValidators/inputValidation";

const selectNotificationRouter = router({
  new: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.notifications.getNewNotifications(
      ctx.req.user?.id,
    );
  }),
});

const writeNotificationRouter = router({
  create: protectedProcedure
    .input(createNotificationInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.notifications.createNotification(
        input,
        ctx.req.user?.id,
      );
    }),

  markOpened: protectedProcedure
    .input(NotificationArrayInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.notifications.markSeen(
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
