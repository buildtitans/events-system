import { trpcClient } from "@/src/trpc/trpcClient";
import type { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";

export async function syncSeenNotifications(
    seen: NotificationSchemaArrayType
): Promise<void> {

    const notificationIds = seen.map((notification) => {
        return notification.id;
    });


    await trpcClient
        .notifications
        .markOpenedNotifications
        .mutate(notificationIds);

};
