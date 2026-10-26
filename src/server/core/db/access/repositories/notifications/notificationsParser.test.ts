import { NotificationValidator } from "./notificationValidator";
import {
  makeNotificationData,
  makeNewNotification,
  makeSeenNotification,
  notificationMetadata,
} from "@/src/test/fixtures/notifications";
import type { RawReadNotification } from "./types";
import { NotificationParser } from "./notificationParser";

function makeRow(
  overrides: Partial<RawReadNotification> = {},
): RawReadNotification {
  return { ...makeNotificationData(), ...notificationMetadata, ...overrides };
}

describe("NotificationParser", () => {
  const validator = new NotificationValidator();
  const parser = new NotificationParser();

  it("accepts empty lists", () => {
    expect(parser.toNotifications({ new: [], seen: [] })).toEqual({
      new: [],
      seen: [],
    });
  });

  it("builds discriminated items with group metadata and serialized dates", () => {
    const updated_at = "2030-01-02T18:00:00.000Z";
    expect(
      parser.toNotifications({
        new: [makeRow()],
        seen: [makeRow({ status: "viewed", updated_at })],
      }),
    ).toEqual({
      new: [makeNewNotification()],
      seen: [makeSeenNotification({ updated_at })],
    });
  });

  it.each([
    { new: [makeRow({ status: "viewed" })], seen: [] },
    { new: [], seen: [makeRow({ status: "new" })] },
  ])("rejects a notification in the wrong status bucket", (result) => {
    expect(() => validator.notifications(parser.toNotifications(result))).toThrow("Invalid Schema");
  });

  it("rejects malformed timestamps", () => {
    expect(() =>
      validator.notifications(parser.toNotifications({
        new: [makeRow({ created_at: "invalid" })],
        seen: [],
      })),
    ).toThrow("Invalid Schema");
  });

  it("rejects missing group metadata", () => {
    const row: Record<string, unknown> = makeRow();
    delete row.group_slug;
    expect(() =>
      validator.notifications(parser.toNotifications({ new: [row as RawReadNotification], seen: [] })),
    ).toThrow("Invalid Schema");
  });

  it("validates creation responses against the new branch", () => {
    expect(validator.newNotification(makeNewNotification())).toEqual(
      makeNewNotification(),
    );
    expect(() => validator.newNotification(makeSeenNotification())).toThrow(
      "Invalid Schema",
    );
    expect(() =>
      validator.newNotification({
        ...makeNewNotification(),
        data: makeNotificationData({ status: "viewed" }),
      }),
    ).toThrow("Invalid Schema");
  });

  it.each([null, new Date("2030-01-02T18:00:00.000Z")])(
    "serializes written notification dates and separates group metadata (%s)",
    (updated_at) => {
      const data = makeNotificationData();
      const result = parser.toNewNotification({
        ...data,
        ...notificationMetadata,
        created_at: new Date(data.created_at),
        updated_at,
      });

      expect(result).toEqual(makeNewNotification({
        updated_at: updated_at?.toISOString() ?? null,
      }));
      expect(validator.newNotification(result)).toEqual(result);
      expect(result.data).not.toHaveProperty("group_slug");
      expect(result.data).not.toHaveProperty("group_name");
    },
  );
});
