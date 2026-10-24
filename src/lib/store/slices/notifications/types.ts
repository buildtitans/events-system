import type { UserNotificationsSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import type { AsyncState } from "@/src/lib/types/state/types";

export type NewAndSeenNotifications = UserNotificationsSchemaType;

export type NotificationAsyncState = AsyncState<
  NewAndSeenNotifications,
  "No new notifications"
>;
export type ReadyNotificationState = Extract<
  NotificationAsyncState,
  { status: "ready" }
>;

export type NotificationState = {
  notifications: NotificationAsyncState;
  initialized: boolean;
  isRefreshing: boolean;
  refreshError?: string;
};
