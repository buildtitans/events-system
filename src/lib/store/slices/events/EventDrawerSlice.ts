import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

export type OpenedEvent = { status: "idle" }
    | { status: "pending" }
    | { status: "ready", data: EventSchemaType }
    | { status: "failed", error: string }

type UserAttendantInfo = EventAttendantsSchemaType;

export type NumberOfAttendantsType = { status: "initial" }
    | { status: "none" }
    | { status: "ready", data: number }

type InitialState = {
    event: OpenedEvent,
    viewerAttendanceInfo: EventAttendantsSchemaType | null,
    numberAttending: NumberOfAttendantsType
};

const initialState: InitialState = {
    event: { status: 'idle' },
    viewerAttendanceInfo: null,
    numberAttending: { status: "initial" }
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
        getNumAttendants: (state: InitialState, action: PayloadAction<NumberOfAttendantsType>) => {
            state.numberAttending = action.payload;
        },
        closeEventDrawer: () => initialState
    }
});

export type EventDrawerSliceType = ReturnType<typeof EventDrawerSlice.reducer>;

export const {
    fillEventDrawer,
    closeEventDrawer,
    getNumAttendants,
    getViewerAttendance,
} = EventDrawerSlice.actions;

export default EventDrawerSlice.reducer;