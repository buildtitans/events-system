import type { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import type { AsyncState } from "@/src/lib/types/state/types";

export type NewAndSeenNotifications = {
  seen: NotificationSchemaArrayType;
  new: NotificationSchemaArrayType;
};

export type NotificationState = AsyncState<
  NewAndSeenNotifications,
  "No new notifications"
>;
export type ReadyNotificationState = Extract<
  NotificationState,
  { status: "ready" }
>;
