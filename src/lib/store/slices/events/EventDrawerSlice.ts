import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

export type OpenedEvent = { status: "idle" }
    | { status: "pending" }
    | { status: "ready", data: EventSchemaType }
    | { status: "failed", error: string }

type UserAttendantInfo = EventAttendantsSchemaType

type InitialState = {
    event: OpenedEvent,
    viewerAttendanceInfo: EventAttendantsSchemaType | null

};

const initialState: InitialState = {
    event: { status: 'idle' },
    viewerAttendanceInfo: null
};

const EventDrawerSlice = createSlice({
    name: "EventDrawer",
    initialState: initialState,
    reducers: {
        fillEventDrawer: (state: InitialState, action: PayloadAction<OpenedEvent>) => {
            state.event = action.payload;
        },
        getViewerAttendance: (state: InitialState, action: PayloadAction<UserAttendantInfo>) => {
            state.viewerAttendanceInfo = action.payload;
        },
        closeEventDrawer: () => initialState
    }
});

export type EventDrawerSliceType = ReturnType<typeof EventDrawerSlice.reducer>;

export const {
    fillEventDrawer,
    closeEventDrawer,
    getViewerAttendance,
} = EventDrawerSlice.actions;

export default EventDrawerSlice.reducer;