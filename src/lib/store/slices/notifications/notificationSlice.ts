import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NotificationState, ReadyNotificationState } from "./types";

type InitialState = {
  notifications: NotificationState;
};

const initialState: InitialState = {
  notifications: { status: "initial" },
};

export const NotificationSlice = createSlice({
  name: "NotificationSlice",
  initialState: initialState,
  reducers: {
    populateNewNotifications: (
      state: InitialState,
      action: PayloadAction<NotificationState>,
    ) => {
      state.notifications = action.payload;
    },
    markSeenNotificaton: (
      state: InitialState,
      action: PayloadAction<ReadyNotificationState>,
    ) => {
      if (state.notifications.status === "ready") {
        const incoming = action.payload.data.seen;
        const updatePayload = [...state.notifications.data.seen, ...incoming];
        state.notifications.data.seen = updatePayload;
      }

      state.notifications = action.payload;
    },
    appendNewNotification: (
      state: InitialState,
      action: PayloadAction<ReadyNotificationState>,
    ) => {
      if (state.notifications.status === "ready") {
        const incoming = action.payload.data.new;
        const appendPayload = [...state.notifications.data.new, ...incoming];
        state.notifications.data.new = appendPayload;
      }
    },
    markSeen: (state: InitialState) => {
      if (state.notifications.status === "ready") {
        state.notifications.status = "ready";

        state.notifications.data.seen = state.notifications.data.new;
        state.notifications.data.new = [];
      }
    },
  },
});

export type NotificationSliceType = ReturnType<
  typeof NotificationSlice.reducer
>;

export const {
  populateNewNotifications,
  markSeenNotificaton,
  appendNewNotification,
  markSeen,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;
