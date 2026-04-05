import { trpcClient } from "@/src/trpc/trpcClient";
import type { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";

export async function syncSeenNotifications(
  seen: NotificationSchemaArrayType,
): Promise<void> {
  await trpcClient.notifications.markOpenedNotifications.mutate(seen);
}
