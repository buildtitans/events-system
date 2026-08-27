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
  it("recovers the current session", async () => {
    const recoveredSession = {
      session: {
        id: "session-1",
        expires_at: new Date("2026-08-21T12:00:00.000Z"),
        user_id: "user-1",
      },
      email: "viewer@example.com",
    };
    const recover = jest.fn().mockResolvedValue(recoveredSession);
    const service = new HydrateUserService({
      auth: { status: { recover: { query: recover } } },
    } as unknown as TrpcClientType);

    await expect(service.recoverSession()).resolves.toEqual(recoveredSession);
    expect(recover).toHaveBeenCalledTimes(1);
  });

  it("returns the viewer attendance dictionary", async () => {
    const attendance = {
      "event-1": "going",
      "event-2": "not_going",
    };
    const getAttendance = jest.fn().mockResolvedValue(attendance);
    const service = new HydrateUserService({
      users: {
        select: {
          attendanceDictionary: { query: getAttendance },
        },
      },
    } as unknown as TrpcClientType);

    await expect(service.attendance()).resolves.toEqual(attendance);
    expect(getAttendance).toHaveBeenCalledTimes(1);
  });

  it("returns new and viewed notifications in server-provided order", async () => {
    const newNotifications = [
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
    const viewedNotifications = [
      createNotificationPlaceholder({
        id: "00000000-0000-4000-8000-000000000004",
        status: "viewed",
        updated_at: "2026-08-10T12:00:00.000Z",
      }),
    ] satisfies NotificationSchemaType[];
    const notifications = {
      new: newNotifications,
      seen: viewedNotifications,
    };

    const service = new HydrateUserService({
      notifications: {
        select: {
          newAndViewed: {
            query: jest.fn().mockResolvedValue(notifications),
          },
        },
      },
    } as unknown as TrpcClientType);

    await expect(service.notifications()).resolves.toStrictEqual(notifications);
  });

  it("hydrates participations and requests next events for the authenticated user", async () => {
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
    expect(nextEvents).toHaveBeenCalledWith();
  });
});
