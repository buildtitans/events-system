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
  const requireCanManageGroup = policyMock.requireCanManageGroup as jest.Mock;

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
    jest.clearAllMocks();
    service = new NotificationService(dbMock, policyMock);
  });

  it("throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(
      service.createNotification(newNotification, null),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
    expect(requireCanManageGroup).not.toHaveBeenCalled();
    expect(getMemberIdsInDb).not.toHaveBeenCalled();
    expect(addNewNotificationsInDb).not.toHaveBeenCalled();
  });

  it("throws a 403 error when the authenticated user cannot manage the group", async () => {
    authenticateAs();
    requireCanManageGroup.mockImplementation(() => {
      throw new Error("403");
    });

    await expect(
      service.createNotification(newNotification, "user-1"),
    ).rejects.toThrow("403");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(requireCanManageGroup).toHaveBeenCalledWith(
      "user-1",
      newNotification.group_id,
    );
    expect(getMemberIdsInDb).not.toHaveBeenCalled();
    expect(addNewNotificationsInDb).not.toHaveBeenCalled();
  });

  it("creates a new notification for members of the group when the user is authenticated and authorized", async () => {
    authenticateAs();
    requireCanManageGroup.mockResolvedValue(undefined);

    getMemberIdsInDb.mockResolvedValue(memberIds);

    addNewNotificationsInDb.mockResolvedValue(
      makeNotification(newNotification),
    );

    await expect(
      service.createNotification(newNotification, "user-1"),
    ).resolves.toMatchObject(notificationResponse);

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(requireCanManageGroup).toHaveBeenCalledWith(
      "user-1",
      newNotification.group_id,
    );
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
    jest.clearAllMocks();
    service = new NotificationService(dbMock, policyMock);
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
  const requireIsGroupMember = policyMock.requireIsGroupMember as jest.Mock;
  let service: NotificationService;

  const seenNotifications = [
    makeNotificationNewOrSeen({
      id: "1",
      user_id: "user-1",
      group_id: "group-1",
      status: "new",
    }),
    makeNotificationNewOrSeen({
      id: "2",
      user_id: "user-1",
      group_id: "group-1",
      status: "new",
    }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationService(dbMock, policyMock);
  });

  it("throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(service.markSeen(null, seenNotifications)).rejects.toThrow(
      "401",
    );

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
    expect(requireIsGroupMember).not.toHaveBeenCalled();
    expect(markOpenedNotificationsInDb).not.toHaveBeenCalled();
  });

  it("throws a 403 error when the authenticated user is not allowed to read notifications for the group", async () => {
    authenticateAs();
    requireIsGroupMember.mockImplementation(() => {
      throw new Error("403");
    });

    await expect(service.markSeen("user-1", seenNotifications)).rejects.toThrow(
      "403",
    );

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(requireIsGroupMember).toHaveBeenCalledWith("user-1", "group-1");
    expect(markOpenedNotificationsInDb).not.toHaveBeenCalled();
  });

  it("marks notifications as seen for an authenticated group member", async () => {
    authenticateAs();
    requireIsGroupMember.mockResolvedValue(undefined);
    markOpenedNotificationsInDb.mockResolvedValue({
      numUpdatedRows: BigInt(2),
    });

    await expect(
      service.markSeen("user-1", seenNotifications),
    ).resolves.toEqual({
      ok: true,
      numUpdated: 2,
    });

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(requireIsGroupMember).toHaveBeenCalledTimes(1);
    expect(requireIsGroupMember).toHaveBeenCalledWith("user-1", "group-1");
    expect(markOpenedNotificationsInDb).toHaveBeenCalledWith({
      ids: ["1", "2"],
      userId: "user-1",
    });
  });
});
