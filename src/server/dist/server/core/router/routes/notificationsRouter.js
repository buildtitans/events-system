"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
const notificationsSchema_1 = require("@/src/schemas/notifications/notificationsSchema");
exports.notificationsRouter = (0, init_1.router)({
    getNotifications: init_1.protectedProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.notifications.getNewNotifications(ctx.req.user?.id);
    }),
    createNotification: init_1.protectedProcedure
        .input(notificationsSchema_1.createNotificationInput)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.notifications.createNotification(input, ctx.req.user?.id);
    }),
    markOpenedNotifications: init_1.protectedProcedure
        .input(notificationsSchema_1.NotificationArrayInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.notifications.markSeen(ctx.req.user?.id, input);
    }),
});
//# sourceMappingURL=notificationsRouter.js.map