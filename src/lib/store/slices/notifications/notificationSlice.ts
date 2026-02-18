import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NewAndSeenNotifications = {
    seen: NotificationSchemaArrayType,
    new: NotificationSchemaArrayType
}

export type NotificationState = { status: "idle" }
    | { status: "pending" }
    | { status: "ready", data: NewAndSeenNotifications }
    | { status: "error", error: string };

type InitialState = {
    notifications: NotificationState,
};


type ReadyNotificationState = Extract<
    NotificationState,
    { status: "ready" }
>;

const initialState: InitialState = {
    notifications: { status: "idle" },
};

export const NotificationSlice = createSlice({
    name: "NotificationSlice",
    initialState: initialState,
    reducers: {

        populateNewNotifications: (state: InitialState, action: PayloadAction<NotificationState>) => {
            state.notifications = action.payload;
        },
        markSeenNotificaton: (state: InitialState, action: PayloadAction<ReadyNotificationState>) => {

            if (state.notifications.status === "ready") {
                const incoming = action.payload.data.seen
                const updatePayload = [...state.notifications.data.seen, ...incoming];
                state.notifications.data.seen = updatePayload;
            }

            state.notifications = action.payload;
        },
        appendNewNotification: (state: InitialState, action: PayloadAction<ReadyNotificationState>) => {
            if (state.notifications.status === "ready") {
                const incoming = action.payload.data.new;
                const appendPayload = [...state.notifications.data.new, ...incoming];
                state.notifications.data.new = appendPayload;
            }
        },
        markSeen: (state: InitialState) => {
            if (state.notifications.status === "ready") {
                state.notifications.status = "ready"

                state.notifications.data.seen = state.notifications.data.new;
                state.notifications.data.new = []
            }
        }

    }
});


export type NotificationSliceType = ReturnType<typeof NotificationSlice.reducer>;

export const {
    populateNewNotifications,
    markSeenNotificaton,
    appendNewNotification,
    markSeen
} = NotificationSlice.actions;

export default NotificationSlice.reducer;