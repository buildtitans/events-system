import { NotificationsParser } from "./notificationsParser";
import { makeNotificationData, makeNewNotification, makeSeenNotification, notificationMetadata } from "@/src/test/fixtures/notifications";
import type { RawReadNotification } from "./types";

function makeRow(overrides: Partial<RawReadNotification> = {}): RawReadNotification {
  return { ...makeNotificationData(), ...notificationMetadata, ...overrides };
}

 describe("NotificationsParser", () => {
  const parser = new NotificationsParser();

  it("accepts empty lists", () => {
    expect(parser.notifications({ new: [], seen: [] })).toEqual({ new: [], seen: [] });
  });

  it("builds discriminated items with group metadata and serialized dates", () => {
    const updated_at = "2030-01-02T18:00:00.000Z";
    expect(parser.notifications({ new: [makeRow()], seen: [makeRow({ status: "viewed", updated_at })] })).toEqual({
      new: [makeNewNotification()], seen: [makeSeenNotification({ updated_at })],
    });
  });

  it.each([
    { new: [makeRow({ status: "viewed" })], seen: [] },
    { new: [], seen: [makeRow({ status: "new" })] },
  ])("rejects a notification in the wrong status bucket", result => {
    expect(() => parser.notifications(result)).toThrow("Invalid Schema");
  });

  it("rejects malformed timestamps", () => {
    expect(() => parser.notifications({ new: [makeRow({ created_at: "invalid" })], seen: [] })).toThrow("Invalid Schema");
  });

  it("rejects missing group metadata", () => {
    const row: Record<string, unknown> = makeRow();
    delete row.group_slug;
    expect(() => parser.notifications({ new: [row as RawReadNotification], seen: [] })).toThrow("Invalid Schema");
  });

  it("validates creation responses against the new branch", () => {
    expect(parser.newNotification(makeNewNotification())).toEqual(makeNewNotification());
    expect(() => parser.newNotification(makeSeenNotification())).toThrow("Invalid Schema");
    expect(() => parser.newNotification({ ...makeNewNotification(), data: makeNotificationData({ status: "viewed" }) })).toThrow("Invalid Schema");
  });
});
