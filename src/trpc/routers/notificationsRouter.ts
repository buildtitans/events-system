import { router, publicProcedure } from "@/src/trpc/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import { wrap } from "@typeschema/typebox";
import {
    CreateNotificationSchemaType,
    CompiledCreateNotificationSchema,
    NotificationSchemaArray,
} from "@/src/schemas/notifications/notificationsSchema";
import { TSchema } from "@sinclair/typebox";

const createNotificationInput = typeboxInput<CreateNotificationSchemaType>(CompiledCreateNotificationSchema);
const getNotificationsOutput = wrap<TSchema>(NotificationSchemaArray);


export const notificationsRouter = router({
    getNotifications:
        publicProcedure
            .output(getNotificationsOutput)
            .mutation(async ({ ctx }) => {
                const user_id = ctx.user?.id;
                if (!user_id) return [];

                return await ctx.api.notifications.getUnseenNotifications(user_id);
            }),

    createNotification:
        publicProcedure
            .input(createNotificationInput)
            .mutation(async ({ ctx, input }) => {

                const memberIds: string[] = await ctx
                    .api
                    .groupMembers
                    .getMemberIds(input.group_id);

                const result = await ctx
                    .api
                    .notifications
                    .addNewNotifications(
                        input,
                        memberIds
                    );

                return { ok: result ? true : false }
            }),
});

export type NotificatonsRouter = typeof notificationsRouter;