import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";

type PresentedCategory = 'Popular Events' | 'Upcoming events';

type GroupNameByGroupID = Record<string, string>;

export type EventsPages = Array<LayoutSlotSchemaType[]>;

type EventCategoryState = {
    displayed: PresentedCategory,
    eventPages: EventsPages,
    currentPage: number,
    nameByGroupId: GroupNameByGroupID
};

const initialState: EventCategoryState = {
    displayed: 'Upcoming events',
    eventPages: [],
    currentPage: 0,
    nameByGroupId: {}
};

export const EventsSlice = createSlice({
    name: 'Events/Categories',
    initialState: initialState,
    reducers: {
        selectCategory: (state: EventCategoryState, action: PayloadAction<PresentedCategory>) => {
            state.displayed = action.payload
        },
        chunkEventPages: (state: EventCategoryState, action: PayloadAction<EventsPages>) => {
            state.eventPages = action.payload
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
        },
        populateEventGroups: (state: EventCategoryState, action: PayloadAction<GroupNameByGroupID>) => {
            state.nameByGroupId = action.payload;
        },
    }
});

export const {
    selectCategory,
    chunkEventPages,
    nextEventsPage,
    prevEventsPage,
    goToEventsPage,
    populateEventGroups
} = EventsSlice.actions;

export default EventsSlice.reducer;

export type EventCategorySliceType = ReturnType<typeof EventsSlice.reducer>;

export type { PresentedCategory, GroupNameByGroupID };