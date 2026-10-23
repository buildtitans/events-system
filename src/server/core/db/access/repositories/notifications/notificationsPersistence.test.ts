jest.mock("kysely/helpers/postgres", () => ({
  jsonArrayFrom: jest.fn(() => ({ as: jest.fn() })),
}));

import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import type { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";
import { NotificationsReader } from "./notificationsReader";
import { NotificationsWriter } from "./notificationsWriter";
import { NotificationsParser } from "./notificationsParser";
import { NotificationsSelector } from "./notificationsSelector";
import { makeNotificationData, makeNewNotification, notificationMetadata } from "@/src/test/fixtures/notifications";

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
    const selectFrom = jest.fn().mockReturnValueOnce(fresh).mockReturnValueOnce(viewed);
    const executeTakeFirstOrThrow = jest.fn().mockResolvedValue({
      new: [{ ...makeNotificationData(), ...notificationMetadata }], seen: [],
    });
    const db = {
      selectNoFrom: jest.fn(callback => {
        callback({ selectFrom });
        return { executeTakeFirstOrThrow };
      }),
    } as unknown as Kysely<DB>;
    const selector = new NotificationsSelector(new NotificationsReader(db), new NotificationsParser());
    await expect(selector.getNotifications(userId)).resolves.toEqual({ new: [makeNewNotification()], seen: [] });
    for (const query of [fresh, viewed]) {
      expect(query.innerJoin).toHaveBeenCalledWith("groups as g", "g.id", "n.group_id");
      expect(query.where).toHaveBeenCalledWith("n.user_id", "=", userId);
      expect(query.select).toHaveBeenCalledWith(["g.slug as group_slug", "g.name as group_name"]);
    }
    expect(fresh.where).toHaveBeenCalledWith("n.status", "=", "new");
    expect(viewed.where).toHaveBeenCalledWith("n.status", "=", "viewed");
    expect(viewed.orderBy).toHaveBeenCalledWith("n.updated_at", "desc");
    expect(viewed.limit).toHaveBeenCalledWith(15);
    expect(fresh.limit).not.toHaveBeenCalled();
  });

  it("returns the creator's enriched notification and serializes database dates", async () => {
    const query = makeQuery();
    query.executeTakeFirstOrThrow.mockResolvedValue({
      ...makeNotificationData(), ...notificationMetadata,
      created_at: new Date(makeNotificationData().created_at), updated_at: null,
    });
    const selectFrom = jest.fn().mockReturnValue(query);
    const db = { with: jest.fn().mockReturnValue({ selectFrom }) } as unknown as Kysely<DB>;
    const writer = new NotificationsWriter(db, new NotificationsParser());
    const { group_id, priority, message, subject } = makeNotificationData();
    await expect(writer.newNotification({ group_id, priority, message, subject }, userId)).resolves.toEqual(makeNewNotification());
    expect(selectFrom).toHaveBeenCalledWith("inserted_notifications as n");
    expect(query.innerJoin).toHaveBeenCalledWith("groups as g", "g.id", "n.group_id");
    expect(query.where).toHaveBeenCalledWith("n.user_id", "=", userId);
  });
});
