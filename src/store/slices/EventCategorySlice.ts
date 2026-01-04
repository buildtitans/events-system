import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PresentedCategory = 'Popular Events' | 'Upcoming events';

type EventCategoryState = {
    displayed: PresentedCategory
};

const initialState: EventCategoryState = {
    displayed: 'Upcoming events'
};

export const EventCategorySlice = createSlice({
    name: 'Events/Categories',
    initialState: initialState,
    reducers: {
        selectCategory: (state: EventCategoryState, action: PayloadAction<PresentedCategory>) => {
            state.displayed = action.payload
        },
    }
});

export const { selectCategory } = EventCategorySlice.actions;

export default EventCategorySlice.reducer;

export type EventCategorySliceType = ReturnType<typeof EventCategorySlice.reducer>;

export type { PresentedCategory };