import { makeNewNotification, makeSeenNotification } from "@/src/test/fixtures/notifications";
import { USER_ID } from "../mockers/mockValues";
import { NotificationService } from "@/src/server/core/service/services/notificationService";
import type { NewNotification } from "@/src/server/core/service/services/types";
import {
  createMockDb,
  policyMock,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("NotificationService.createNotification", () => {
  const requireOrganizer = policyMock.requireOrganizer as jest.Mock;



  const newNotification = {
    group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    priority: "high",
    message: "string",
    subject: "string",
  } satisfies NewNotification;

  const notificationResponse = makeNewNotification(newNotification);

  let service: NotificationService;
  let db: ReturnType<typeof createMockDb>;
  let newNotificationInDb: jest.Mock;
  let getMemberIdsInDb: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    db = createMockDb();
    newNotificationInDb = db.notifications.write
      .newNotification as jest.Mock;
    getMemberIdsInDb = db.groupMembers.select.memberIds as jest.Mock;
    service = new NotificationService(db, policyMock);
  });

  it("throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(
      service.createNotification(newNotification, null),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
    expect(requireOrganizer).not.toHaveBeenCalled();
    expect(getMemberIdsInDb).not.toHaveBeenCalled();
    expect(newNotificationInDb).not.toHaveBeenCalled();
  });

  it("throws a 403 error when the authenticated user cannot manage the group", async () => {
    authenticateAs();
    requireOrganizer.mockImplementation(() => {
      throw new Error("403");
    });

    await expect(
      service.createNotification(newNotification, USER_ID),
    ).rejects.toThrow("403");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(requireOrganizer).toHaveBeenCalledWith(
      "user-1",
      newNotification.group_id,
    );
    expect(getMemberIdsInDb).not.toHaveBeenCalled();
    expect(newNotificationInDb).not.toHaveBeenCalled();
  });

  it("creates a new notification for members of the group when the user is authenticated and authorized", async () => {
    authenticateAs();
    requireOrganizer.mockResolvedValue(undefined);


    newNotificationInDb.mockResolvedValue(
      makeNewNotification(newNotification),
    );

    await expect(
      service.createNotification(newNotification, USER_ID),
    ).resolves.toEqual(notificationResponse);

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(requireOrganizer).toHaveBeenCalledWith(
      "user-1",
      newNotification.group_id,
    );
    expect(getMemberIdsInDb).not.toHaveBeenCalled();
    expect(newNotificationInDb).toHaveBeenCalledWith(
      newNotification,
      "user-1",
    );
  });
});

describe("NotificationService.getNotifications", () => {
  let service: NotificationService;
  let db: ReturnType<typeof createMockDb>;
  let getNotificationsInDb: jest.Mock;

  const newNotifications = [
    makeNewNotification({ id: "new-1", status: "new" }),
  ];
  const seenNotifications = [
    makeSeenNotification({
      id: "seen-1",
      status: "viewed",
      updated_at: "2026-08-10T12:00:00.000Z",
    }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    db = createMockDb();
    getNotificationsInDb = db.notifications.select.getNotifications as jest.Mock;
    service = new NotificationService(db, policyMock);
  });

  it("throws a 401 error before reading notifications when the user is not authenticated", async () => {
    unauthenticated();

    await expect(service.getNotifications(null)).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
    expect(getNotificationsInDb).not.toHaveBeenCalled();
  });

  it("returns new and viewed notifications for the authenticated user", async () => {
    authenticateAs(USER_ID);
    getNotificationsInDb.mockResolvedValue({ new: newNotifications, seen: seenNotifications });

    await expect(service.getNotifications(USER_ID)).resolves.toEqual({
      new: newNotifications,
      seen: seenNotifications,
    });

    expect(getNotificationsInDb).toHaveBeenCalledTimes(1);
    expect(getNotificationsInDb).toHaveBeenCalledWith("user-1");
  });
});

describe("NotificationService.markSeen", () => {
  let service: NotificationService;
  let db: ReturnType<typeof createMockDb>;
  let markOpenedNotificationsInDb: jest.Mock;

  const seenNotificationIds = ["notification-1", "notification2"];

  beforeEach(() => {
    jest.clearAllMocks();
    db = createMockDb();
    markOpenedNotificationsInDb = db.notifications.write
      .markOpenedNotifications as jest.Mock;
    service = new NotificationService(db, policyMock);
  });

  it("throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(service.markSeen(null, seenNotificationIds)).rejects.toThrow(
      "401",
    );

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
    expect(markOpenedNotificationsInDb).not.toHaveBeenCalled();
  });

  it("marks notifications as seen for the authenticated user", async () => {
    authenticateAs();
    markOpenedNotificationsInDb.mockResolvedValue({
      numUpdatedRows: BigInt(2),
    });

    await expect(
      service.markSeen(USER_ID, seenNotificationIds),
    ).resolves.toEqual({
      ok: true,
      numUpdated: 2,
    });

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(markOpenedNotificationsInDb).toHaveBeenCalledWith({
      ids: seenNotificationIds,
      userId: "user-1",
    });
  });
});
