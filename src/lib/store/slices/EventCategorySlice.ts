import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EventsArraySchemaType } from "@/src/schemas/eventSchema";
import { chunkEventsIntoPages } from "../../utils/helpers/chunkIntoPages";

type PresentedCategory = 'Popular Events' | 'Upcoming events';

type EventCategoryState = {
    displayed: PresentedCategory,
    eventPages: Array<EventsArraySchemaType>,
    currentPage: number
};

const initialState: EventCategoryState = {
    displayed: 'Upcoming events',
    eventPages: [],
    currentPage: 0
};

export const EventCategorySlice = createSlice({
    name: 'Events/Categories',
    initialState: initialState,
    reducers: {
        selectCategory: (state: EventCategoryState, action: PayloadAction<PresentedCategory>) => {
            state.displayed = action.payload
        },
        chunkEventPages: (state: EventCategoryState, action: PayloadAction<EventsArraySchemaType>) => {
            state.eventPages = chunkEventsIntoPages(action.payload, 6);
            state.currentPage = 0;
        },
        nextEventsPage: (state: EventCategoryState) => {
            if ((state.currentPage) < (state.eventPages.length - 1)) {
                state.currentPage += 1;
            }
        },
        prevEventsPage: (state: EventCategoryState) => {
            if (state.currentPage >= 1) {
                state.currentPage -= 1;
            }
        },
        goToEventsPage: (state: EventCategoryState, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        }
    }
});

export const {
    selectCategory,
    chunkEventPages,
    nextEventsPage,
    prevEventsPage,
    goToEventsPage
} = EventCategorySlice.actions;

export default EventCategorySlice.reducer;

export type EventCategorySliceType = ReturnType<typeof EventCategorySlice.reducer>;

export type { PresentedCategory };