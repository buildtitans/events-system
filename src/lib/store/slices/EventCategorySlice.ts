import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EventsArraySchemaType } from "@/src/schemas/eventSchema";

type PresentedCategory = 'Popular Events' | 'Upcoming events';

type EventCategoryState = {
    displayed: PresentedCategory,
    events: EventsArraySchemaType
};

const initialState: EventCategoryState = {
    displayed: 'Upcoming events',
    events: []
};

export const EventCategorySlice = createSlice({
    name: 'Events/Categories',
    initialState: initialState,
    reducers: {
        selectCategory: (state: EventCategoryState, action: PayloadAction<PresentedCategory>) => {
            state.displayed = action.payload
        },
        getEvents: (state: EventCategoryState, action: PayloadAction<EventsArraySchemaType>) => {
            state.events = action.payload;
            console.log(state.events)
        }
    }
});

export const { selectCategory, getEvents } = EventCategorySlice.actions;

export default EventCategorySlice.reducer;

export type EventCategorySliceType = ReturnType<typeof EventCategorySlice.reducer>;

export type { PresentedCategory };