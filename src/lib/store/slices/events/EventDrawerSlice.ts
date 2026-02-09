import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/eventAttendantsSchema";



type EventForDrawer = EventSchemaType | null

type UserAttendantInfo = EventAttendantsSchemaType


type InitialState = {
    event: EventForDrawer,
    viewerAttendanceInfo: EventAttendantsSchemaType | null

};

const initialState: InitialState = {
    event: null,
    viewerAttendanceInfo: null
};

const EventDrawerSlice = createSlice({
    name: "EventDrawer",
    initialState: initialState,
    reducers: {
        openEventDrawer: (state: InitialState, action: PayloadAction<EventForDrawer>) => {
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
    openEventDrawer,
    closeEventDrawer,
    getViewerAttendance,
} = EventDrawerSlice.actions;

export default EventDrawerSlice.reducer;