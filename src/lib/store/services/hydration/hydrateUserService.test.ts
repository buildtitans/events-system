import { HydrateUserService } from "@/src/lib/store/services/hydration/hydrateUserService";
import { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

function createNotificationPlaceholder(
  overrides: Partial<NotificationSchemaType> = {},
): NotificationSchemaType {
  return {
    created_at: "2026-08-09T12:00:00.000Z",
    group_id: "00000000-0000-4000-8000-000000000001",
    id: "00000000-0000-4000-8000-000000000002",
    subject: "Notification subject",
    message: "Notification message",
    priority: "moderate",
    status: "new",
    updated_at: null,
    user_id: "00000000-0000-4000-8000-000000000003",
    ...overrides,
  };
}

describe("HydrateUserService", () => {
  it("returns new notifications in server-provided order", async () => {
    const notifications = [
      createNotificationPlaceholder({
        id: "00000000-0000-4000-8000-000000000001",
        priority: "low",
      }),
      createNotificationPlaceholder({
        id: "00000000-0000-4000-8000-000000000002",
        priority: "high",
      }),
      createNotificationPlaceholder({
        id: "00000000-0000-4000-8000-000000000003",
        priority: "moderate",
      }),
    ] satisfies NotificationSchemaType[];

    const service = new HydrateUserService({
      notifications: {
        select: {
          new: {
            query: jest.fn().mockResolvedValue(notifications),
          },
        },
      },
    } as unknown as TrpcClientType);

    await expect(service.notifications()).resolves.toStrictEqual(notifications);
  });

  it("hydrates participations and requests next events by membership group id", async () => {
    const rsvps = [{ event_id: "event-1" }];
    const memberships = [{ group_id: "group-1" }, { group_id: "group-2" }];
    const lookup = { "group-1": { id: "event-2" } };
    const nextEvents = jest.fn().mockResolvedValue(lookup);
    const service = new HydrateUserService({
      eventAttendants: {
        select: { rsvps: { query: jest.fn().mockResolvedValue(rsvps) } },
      },
      users: {
        select: {
          memberships: { query: jest.fn().mockResolvedValue(memberships) },
        },
      },
      groups: { lookup: { nextEvents: { query: nextEvents } } },
    } as unknown as TrpcClientType);

    await expect(service.participations()).resolves.toEqual({
      participations: { rsvps, memberships },
      lookup,
    });
    expect(nextEvents).toHaveBeenCalledWith(["group-1", "group-2"]);
  });
});
