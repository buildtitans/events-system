import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import type {
    PresentedCategory,
    EventsDomainType,
    GroupNameByGroupID
} from "./types";



type EventCategoryState = {
    displayed: PresentedCategory,
    eventPages: EventsDomainType,
    currentPage: number,
    nameByGroupId: GroupNameByGroupID
};

const initialState: EventCategoryState = {
    displayed: "All Events",
    eventPages: { status: "initial" },
    currentPage: 0,
    nameByGroupId: {}
};

export const EventsSlice = createSlice({
    name: 'Events/Categories',
    initialState: initialState,
    reducers: {
        selectCategory: (
            state: EventCategoryState,
            action: PayloadAction<PresentedCategory>
        ) => {
            state.displayed = action.payload
        },
        populateEvents: (
            state: EventCategoryState,
            action: PayloadAction<EventsDomainType>
        ) => {
            state.eventPages = action.payload
            state.currentPage = 0;
        },
        nextEventsPage: (
            state: EventCategoryState
        ) => {
            const isHydratedAndCanIncrement: boolean =
                (state.eventPages.status === "ready") &&
                ((state.currentPage) < (state.eventPages.data.length - 1));

            if (isHydratedAndCanIncrement) {
                state.currentPage += 1;
            }
        },
        prevEventsPage: (
            state: EventCategoryState
        ) => {
            if (state.currentPage >= 1) {
                state.currentPage -= 1;
            }
        },
        goToEventsPage: (
            state: EventCategoryState,
            action: PayloadAction<number>
        ) => {
            state.currentPage = action.payload;
        },

    }
});

export const {
    selectCategory,
    populateEvents,
    nextEventsPage,
    prevEventsPage,
    goToEventsPage,
} = EventsSlice.actions;

export default EventsSlice.reducer;

export type EventCategorySliceType = ReturnType<typeof EventsSlice.reducer>;

export type { PresentedCategory, GroupNameByGroupID };