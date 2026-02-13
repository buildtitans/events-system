import { router, publicProcedure } from "@/src/trpc/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import {
    CreateNotificationSchemaType,
    CompiledCreateNotificationSchema,
} from "@/src/schemas/notifications/notificationsSchema";

const createNotificationInput = typeboxInput<CreateNotificationSchemaType>(CompiledCreateNotificationSchema);

export const notificationsRouter = router({
    getNotifications:
        publicProcedure
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

                return await ctx
                    .api
                    .notifications
                    .addNewNotifications(
                        input,
                        memberIds
                    );


            }),
});

export type NotificatonsRouter = typeof notificationsRouter;