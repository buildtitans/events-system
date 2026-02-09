import { EventAttendantsSchemaType } from "@/src/schemas/eventAttendantsSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EventAttendantsState = {
    attendants: EventAttendantsSchemaType[]
};

const initialState: EventAttendantsState = {
    attendants: []
};

const EventAttendantsSlice = createSlice({
    name: "eventAttendants",
    initialState: initialState,
    reducers: {
        getEventAttendants: (state: EventAttendantsState, action: PayloadAction<EventAttendantsSchemaType[]>) => {
            state.attendants = action.payload;
        }
    }
});


export type EventAttendantsSliceType = ReturnType<typeof EventAttendantsSlice.reducer>;

export const {
    getEventAttendants
} = EventAttendantsSlice.actions;

export default EventAttendantsSlice.reducer;