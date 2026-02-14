import { trpcClient } from "@/src/trpc/trpcClient";
import type { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";

export async function syncSeenNotifications(
    seen: NotificationSchemaArrayType
): Promise<void> {

    const notificationIds = seen.map((notification) => {
        return notification.id;
    });

    console.log("***** SYNCING SEEN NOTIFICATIONS.... ********")

    await trpcClient
        .notifications
        .markOpenedNotifications
        .mutate(notificationIds);

    console.log("***** SYNC FINISHED ********")
};
