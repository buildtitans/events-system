import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NewAndSeenNotifications, NotificationState } from "./types";
import { hydrateNotifications, refreshNotifications } from "./thunks";
import { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";

const initialState: NotificationState = {
  notifications: { status: "initial" },
  initialized: false,
  isRefreshing: false,
  refreshError: undefined,
};

export const NotificationSlice = createSlice({
  name: "NotificationSlice",
  initialState: initialState,
  reducers: {
    appendNewNotification: (
      state: NotificationState,
      action: PayloadAction<NotificationSchemaType>,
    ) => {
      if (state.notifications.status === "ready") {
        state.notifications.data.new.push(action.payload);
      }
    },
    markSeen: (state: NotificationState) => {
      if (state.notifications.status === "ready") {
        state.notifications.status = "ready";

        state.notifications.data.seen = [
          ...state.notifications.data.new,
          ...state.notifications.data.seen,
        ];

        state.notifications.data.new = [];
      }
    },
    clearNotificationSlice: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(
      hydrateNotifications.pending,
      (state: NotificationState) => {
        state.notifications.status = "pending";
      },
    );

    builder.addCase(hydrateNotifications.rejected, (state, action) => {
      state.notifications = {
        status: "failed",
        error: String(action.payload),
      };
    });

    builder.addCase(
      hydrateNotifications.fulfilled,
      (
        state: NotificationState,
        action: PayloadAction<NewAndSeenNotifications>,
      ) => {
        state.notifications = {
          status: "ready",
          data: { new: action.payload.new, seen: action.payload.seen },
        };
        state.initialized = true;
        state.isRefreshing = false;
        state.refreshError = undefined;
      },
    );

    builder.addCase(
      refreshNotifications.pending,
      (state: NotificationState) => {
        state.isRefreshing = true;
      },
    );

    builder.addCase(
      refreshNotifications.rejected,
      (state: NotificationState, action) => {
        state.isRefreshing = false;
        state.refreshError = String(action.payload);
      },
    );

    builder.addCase(
      refreshNotifications.fulfilled,
      (
        state: NotificationState,
        action: PayloadAction<NewAndSeenNotifications>,
      ) => {
        state.notifications = {
          status: "ready",
          data: { new: action.payload.new, seen: action.payload.seen },
        };
        state.initialized = true;
        state.isRefreshing = false;
        state.refreshError = undefined;
      },
    );
  },
});

export type NotificationSliceType = ReturnType<
  typeof NotificationSlice.reducer
>;

export const { markSeen, clearNotificationSlice, appendNewNotification } =
  NotificationSlice.actions;

export default NotificationSlice.reducer;
