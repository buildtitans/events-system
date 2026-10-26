jest.mock("kysely/helpers/postgres", () => ({
  jsonArrayFrom: jest.fn(() => ({ as: jest.fn() })),
}));

import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import type { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";
import { NotificationsReader, type INotificationsReader } from "./notificationsReader";
import { NotificationsWriter } from "./notificationsWriter";
import { NotificationValidator } from "./notificationValidator";
import { NotificationsSelector } from "./notificationsSelector";
import {
  makeNotificationData,
  makeNewNotification,
  makeSeenNotification,
  notificationMetadata,
} from "@/src/test/fixtures/notifications";
import { NotificationParser } from "./notificationParser";

const userId = makeNotificationData().user_id as AuthenticatedUserId;

function makeQuery() {
  return {
    innerJoin: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    executeTakeFirstOrThrow: jest.fn(),
  };
}

describe("notification persistence", () => {
  it("hydrates both buckets with group metadata while keeping viewed history limited", async () => {
    const fresh = makeQuery();
    const viewed = makeQuery();
    const selectFrom = jest
      .fn()
      .mockReturnValueOnce(fresh)
      .mockReturnValueOnce(viewed);
    const executeTakeFirstOrThrow = jest.fn().mockResolvedValue({
      new: [{ ...makeNotificationData(), ...notificationMetadata }],
      seen: [{ ...makeNotificationData({ status: "viewed", updated_at: "2030-01-02T18:00:00.000Z" }), ...notificationMetadata }],
    });
    const db = {
      selectNoFrom: jest.fn((callback) => {
        callback({ selectFrom });
        return { executeTakeFirstOrThrow };
      }),
    } as unknown as Kysely<DB>;
    const selector = new NotificationsSelector(
      new NotificationsReader(db, new NotificationParser()),
      new NotificationValidator(),
    );
    await expect(selector.getNotifications(userId)).resolves.toEqual({
      new: [makeNewNotification()],
      seen: [makeSeenNotification({ updated_at: "2030-01-02T18:00:00.000Z" })],
    });
    for (const query of [fresh, viewed]) {
      expect(query.innerJoin).toHaveBeenCalledWith(
        "groups as g",
        "g.id",
        "n.group_id",
      );
      expect(query.where).toHaveBeenCalledWith("n.user_id", "=", userId);
      expect(query.select).toHaveBeenCalledWith([
        "g.slug as group_slug",
        "g.name as group_name",
      ]);
    }
    expect(fresh.where).toHaveBeenCalledWith("n.status", "=", "new");
    expect(viewed.where).toHaveBeenCalledWith("n.status", "=", "viewed");
    expect(viewed.orderBy).toHaveBeenCalledWith("n.updated_at", "desc");
    expect(viewed.limit).toHaveBeenCalledWith(15);
    expect(fresh.limit).not.toHaveBeenCalled();
    expect(fresh.orderBy).toHaveBeenCalledWith("n.created_at", "desc");
  });

  it("returns the creator's enriched notification and serializes database dates", async () => {
    const query = makeQuery();
    query.executeTakeFirstOrThrow.mockResolvedValue({
      ...makeNotificationData(),
      ...notificationMetadata,
      created_at: new Date(makeNotificationData().created_at),
      updated_at: null,
    });
    const selectFrom = jest.fn().mockReturnValue(query);
    const db = {
      with: jest.fn().mockReturnValue({ selectFrom }),
    } as unknown as Kysely<DB>;
    const writer = new NotificationsWriter(
      db,
      new NotificationValidator(),
      new NotificationParser(),
    );
    const { group_id, priority, message, subject } = makeNotificationData();
    await expect(
      writer.newNotification({ group_id, priority, message, subject }, userId),
    ).resolves.toEqual(makeNewNotification());
    expect(selectFrom).toHaveBeenCalledWith("inserted_notifications as n");
    expect(query.innerJoin).toHaveBeenCalledWith(
      "groups as g",
      "g.id",
      "n.group_id",
    );
    expect(query.where).toHaveBeenCalledWith("n.user_id", "=", userId);
  });

  it("rejects invalid parsed data at the selector boundary", async () => {
    const read: jest.Mocked<INotificationsReader> = { notifications: jest.fn() };
    read.notifications.mockResolvedValue({ new: [makeSeenNotification()], seen: [] });
    const selector = new NotificationsSelector(read, new NotificationValidator());

    await expect(selector.getNotifications(userId)).rejects.toThrow("Invalid Schema");
    expect(read.notifications).toHaveBeenCalledWith(userId);
  });

  it("propagates read failures", async () => {
    const error = new Error("Database unavailable");
    const read: jest.Mocked<INotificationsReader> = {
      notifications: jest.fn().mockRejectedValue(error),
    };
    const selector = new NotificationsSelector(read, new NotificationValidator());
    await expect(selector.getNotifications(userId)).rejects.toBe(error);
  });

  it("marks only the requested user's notifications viewed", async () => {
    const now = new Date("2030-01-02T18:00:00.000Z");
    jest.useFakeTimers().setSystemTime(now);
    try {
      const result = { numUpdatedRows: BigInt(1) };
      const query = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(result),
      };
      const updateTable = jest.fn().mockReturnValue(query);
      const db = { updateTable } as unknown as Kysely<DB>;
      const writer = new NotificationsWriter(db, new NotificationValidator(), new NotificationParser());
      const ids = [makeNotificationData().id];

      await expect(writer.markOpenedNotifications({ ids, userId })).resolves.toEqual(result);
      expect(updateTable).toHaveBeenCalledWith("notifications");
      expect(query.set).toHaveBeenCalledWith({ status: "viewed", updated_at: now });
      expect(query.where).toHaveBeenCalledWith("id", "in", ids);
      expect(query.where).toHaveBeenCalledWith("user_id", "=", userId);
    } finally {
      jest.useRealTimers();
    }
  });
});
