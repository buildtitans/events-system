import { router, publicProcedure } from "@/src/trpc/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
import {
    NotificationSchemaType,
    NotificationSchemaArrayType,
    CreateNotificationSchemaType,
    CompiledCreateNotificationSchema,
    NotificationSchema,
    CompiledNotificationSchema,
} from "@/src/schemas/notifications/notificationsSchema";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";


export const notificationsRouter = router({
    getNotifications:
        publicProcedure
            .mutation(async ({ ctx }) => {
                const user_id = ctx.user?.id;
                if (!user_id) return;

                return await ctx.api.notifications.getUnseenNotifications(user_id);
            }),

    createNotification:
        publicProcedure
            .input(typeboxInput<CreateNotificationSchemaType>(CompiledCreateNotificationSchema))
            .mutation(async ({ ctx, input }) => {

                const membersToNotify = await ctx.api.groupMembers.getGroupMembers(input.group_id);

                const memberIds = membersToNotify.map((member: GroupMembersSchemaType) => {
                    return member.user_id
                });

                return await ctx.api.notifications.addNewNotification(input, memberIds);
            })
})