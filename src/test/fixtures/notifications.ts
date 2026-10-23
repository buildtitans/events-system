import type { NotificationSchemaType, UserNotificationsSchemaType } from "@/src/schemas/notifications/notificationsSchema";

export function makeNotificationData(overrides: Partial<NotificationSchemaType> = {}): NotificationSchemaType {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    group_id: "00000000-0000-4000-8000-000000000002",
    user_id: "00000000-0000-4000-8000-000000000003",
    created_at: "2030-01-01T18:00:00.000Z",
    updated_at: null,
    subject: "Group update",
    message: "A new event is scheduled",
    priority: "high",
    status: "new",
    ...overrides,
  };
}

export const notificationMetadata = { group_name: "Local Developers", group_slug: "local-developers" };

export function makeNewNotification(overrides: Partial<NotificationSchemaType> = {}): UserNotificationsSchemaType["new"][number] {
  return { kind: "new", data: { ...makeNotificationData(overrides), status: "new" }, meta: { ...notificationMetadata } };
}

export function makeSeenNotification(overrides: Partial<NotificationSchemaType> = {}): UserNotificationsSchemaType["seen"][number] {
  return { kind: "seen", data: { ...makeNotificationData(overrides), status: "viewed" }, meta: { ...notificationMetadata } };
}
