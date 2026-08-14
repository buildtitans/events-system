jest.mock("./thunks", () => {
  const { createAsyncThunk } = jest.requireActual("@reduxjs/toolkit") as typeof import("@reduxjs/toolkit");

  return {
    hydrateNotifications: createAsyncThunk(
      "NotificationSlice/hydrateNotifications",
      async () => ({ new: [], seen: [] }),
    ),
    refreshNotifications: createAsyncThunk(
      "NotificationSlice/refreshNotifications",
      async () => ({ new: [], seen: [] }),
    ),
  };
});

import notificationReducer, {
  appendNewNotifications,
  clearNotificationSlice,
  markSeen,
} from "./notificationSlice";
import { hydrateNotifications, refreshNotifications } from "./thunks";
import type { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";

function makeNotification(
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

describe("NotificationSlice", () => {
  it("hydrates new and viewed notifications", () => {
    const newNotification = makeNotification({ id: "new-1" });
    const seenNotification = makeNotification({
      id: "seen-1",
      status: "viewed",
      updated_at: "2026-08-10T12:00:00.000Z",
    });

    const state = notificationReducer(
      undefined,
      hydrateNotifications.fulfilled(
        { new: [newNotification], seen: [seenNotification] },
        "request-1",
        undefined,
      ),
    );

    expect(state).toEqual({
      notifications: {
        status: "ready",
        data: {
          new: [newNotification],
          seen: [seenNotification],
        },
      },
      initialized: true,
      isRefreshing: false,
      refreshError: undefined,
    });
  });

  it("moves new notifications into viewed history without replacing existing history", () => {
    const newNotification = makeNotification({ id: "new-1" });
    const existingSeenNotification = makeNotification({
      id: "seen-1",
      status: "viewed",
    });
    const readyState = notificationReducer(
      undefined,
      hydrateNotifications.fulfilled(
        { new: [newNotification], seen: [existingSeenNotification] },
        "request-1",
        undefined,
      ),
    );

    const state = notificationReducer(readyState, markSeen());

    expect(state.notifications).toEqual({
      status: "ready",
      data: {
        new: [],
        seen: [newNotification, existingSeenNotification],
      },
    });
  });

  it("appends newly created notifications without changing viewed history", () => {
    const existingSeenNotification = makeNotification({
      id: "seen-1",
      status: "viewed",
    });
    const createdNotification = makeNotification({ id: "new-1" });
    const readyState = notificationReducer(
      undefined,
      hydrateNotifications.fulfilled(
        { new: [], seen: [existingSeenNotification] },
        "request-1",
        undefined,
      ),
    );

    const state = notificationReducer(
      readyState,
      appendNewNotifications([createdNotification]),
    );

    expect(state.notifications).toEqual({
      status: "ready",
      data: {
        new: [createdNotification],
        seen: [existingSeenNotification],
      },
    });
  });

  it("preserves notification data when a refresh fails", () => {
    const notification = makeNotification({ id: "new-1" });
    const readyState = notificationReducer(
      undefined,
      hydrateNotifications.fulfilled(
        { new: [notification], seen: [] },
        "request-1",
        undefined,
      ),
    );
    const pendingState = notificationReducer(
      readyState,
      refreshNotifications.pending("request-2", undefined),
    );

    const state = notificationReducer(
      pendingState,
      refreshNotifications.rejected(
        new Error("network unavailable"),
        "request-2",
        undefined,
        "Failed to refresh notifications",
      ),
    );

    expect(state.notifications).toEqual(readyState.notifications);
    expect(state.isRefreshing).toBe(false);
    expect(state.refreshError).toBe("Failed to refresh notifications");
  });

  it("clears notification data and refresh metadata", () => {
    const notification = makeNotification({ id: "new-1" });
    const readyState = notificationReducer(
      undefined,
      hydrateNotifications.fulfilled(
        { new: [notification], seen: [] },
        "request-1",
        undefined,
      ),
    );

    expect(notificationReducer(readyState, clearNotificationSlice())).toEqual({
      notifications: { status: "initial" },
      initialized: false,
      isRefreshing: false,
      refreshError: undefined,
    });
  });
});
