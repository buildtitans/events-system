import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NotificationState = { status: "idle" }
    | { status: "pending" }
    | { status: "ready", data: NotificationSchemaArrayType }
    | { status: "error", error: string };

type InitialState = {
    new: NotificationState,
    opened: NotificationState
};

type ReadyNotificationState = Extract<
    NotificationState,
    { status: "ready" }
>;

const initialState: InitialState = {
    new: { status: "idle" },
    opened: { status: "idle" }
};

export const NotificationSlice = createSlice({
    name: "NotificationSlice",
    initialState: initialState,
    reducers: {

        populateNewNotifications: (state: InitialState, action: PayloadAction<NotificationState>) => {
            state.new = action.payload
        },
        markSeenNotificaton: (state: InitialState, action: PayloadAction<ReadyNotificationState>) => {

            if (state.opened.status === "ready") {
                const incoming = action.payload.data
                const updatePayload = [...state.opened.data, ...incoming];
                state.opened.data = updatePayload;
            }

            state.opened = action.payload;
        },

    }
});


export type NotificationSliceType = ReturnType<typeof NotificationSlice.reducer>;

export const {
    populateNewNotifications,
    markSeenNotificaton
} = NotificationSlice.actions;