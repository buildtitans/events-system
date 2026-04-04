import { NotificationService } from "@/src/server/core/service/services/notificationService";
import type { NewNotification } from "@/src/server/core/service/services/notificationService";
import {
  dbMock,
  policyMock,
  makeNotificationNewOrSeen,
  makeNotification,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("NotificationService.createNotification", () => {
  const addNewNotificationsInDb = dbMock.notifications
    .addNewNotifications as jest.Mock;
  const getMemberIdsInDb = dbMock.groupMembers.getMemberIds as jest.Mock;

  const memberIds = ["00000000-83c9-46de-90ac-fe4047a00000"];

  const newNotification = {
    group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    priority: "string",
    message: "string",
    subject: "string",
  } satisfies NewNotification;

  const notificationResponse = makeNotification(newNotification);

  let service: NotificationService;

  beforeEach(() => {
    (jest.clearAllMocks(),
      (service = new NotificationService(dbMock, policyMock)));
  });

  it("creates a new notification for members of the group", async () => {
    getMemberIdsInDb.mockResolvedValue(memberIds);

    addNewNotificationsInDb.mockResolvedValue(
      makeNotification(newNotification),
    );

    await expect(
      service.createNotification(newNotification),
    ).resolves.toMatchObject(notificationResponse);

    expect(policyMock.requireAuthenticated).not.toHaveBeenCalled();
    expect(getMemberIdsInDb).toHaveBeenCalledWith(newNotification.group_id);
    expect(addNewNotificationsInDb).toHaveBeenCalledWith(
      newNotification,
      memberIds,
    );
  });
});

describe("NotificationService.getNewNotifications", () => {
  const getUnseenNotificationsInDb = dbMock.notifications
    .getUnseenNotifications as jest.Mock;
  let service: NotificationService;

  const notifications = [
    makeNotificationNewOrSeen({ id: "1", status: "new" }),
    makeNotificationNewOrSeen({ id: "3", status: "new" }),
  ];

  beforeEach(() => {
    (jest.clearAllMocks(),
      (service = new NotificationService(dbMock, policyMock)));
  });

  it("Throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(service.getNewNotifications(null)).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
    expect(getUnseenNotificationsInDb).not.toHaveBeenCalled();
  });

  it("returns unseen notifications for the authenticated user", async () => {
    authenticateAs();

    getUnseenNotificationsInDb.mockResolvedValue(notifications);

    await expect(service.getNewNotifications("user-1")).resolves.toEqual(
      notifications,
    );

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(getUnseenNotificationsInDb).toHaveBeenCalledWith("user-1");
  });
});

describe("NotificationService.markSeen", () => {
  const markOpenedNotificationsInDb = dbMock.notifications
    .markOpenedNotifications as jest.Mock;
  let service: NotificationService;

  beforeEach(() => {
    (jest.clearAllMocks(),
      (service = new NotificationService(dbMock, policyMock)));
  });

  it("throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(service.markSeen(null, ["1", "2"])).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
    expect(markOpenedNotificationsInDb).not.toHaveBeenCalled();
  });

  it("marks notifications as seen for an authenticated user", async () => {
    authenticateAs();
    markOpenedNotificationsInDb.mockResolvedValue(undefined);

    await expect(
      service.markSeen("user-1", ["1", "2"]),
    ).resolves.toBeUndefined();

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(markOpenedNotificationsInDb).toHaveBeenCalledWith(["1", "2"]);
  });
});
