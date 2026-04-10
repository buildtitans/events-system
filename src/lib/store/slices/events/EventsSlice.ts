import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type {
  EventDisplayFilter,
  EventsDomainType,
  GroupNameByGroupID,
} from "./types";
import { initializeDomains } from "../rendering/RenderingSlice";

type EventCategoryState = {
  displayed: EventDisplayFilter;
  eventPages: EventsDomainType;
  currentPage: number;
  nameByGroupId: GroupNameByGroupID;
};

const initialState: EventCategoryState = {
  displayed: "All Events",
  eventPages: { status: "initial" },
  currentPage: 0,
  nameByGroupId: {},
};

export const EventsSlice = createSlice({
  name: "Events/Categories",
  initialState: initialState,
  reducers: {
    selectDisplayFilter: (
      state: EventCategoryState,
      action: PayloadAction<EventDisplayFilter>,
    ) => {
      state.displayed = action.payload;
    },
    populateEvents: (
      state: EventCategoryState,
      action: PayloadAction<EventsDomainType>,
    ) => {
      state.eventPages = action.payload;
      state.currentPage = 0;
    },
    nextEventsPage: (state: EventCategoryState) => {
      const isHydratedAndCanIncrement: boolean =
        state.eventPages.status === "ready" &&
        state.currentPage < state.eventPages.data.length - 1;

      if (isHydratedAndCanIncrement) {
        state.currentPage += 1;
      }
    },
    prevEventsPage: (state: EventCategoryState) => {
      if (state.currentPage >= 1) {
        state.currentPage -= 1;
      }
    },
    goToEventsPage: (
      state: EventCategoryState,
      action: PayloadAction<number>,
    ) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<EventCategoryState>) => {
    builder.addCase(initializeDomains, (state, action) => {
      state.eventPages.status = "pending";

      const result = action.payload;

      if (result.status === "fulfilled") {
        state.eventPages = {
          status: "ready",
          data: result.data.events,
        };

        state.currentPage = 0;
      } else {
        state.eventPages = {
          status: "failed",
          error: "Failed to retrieve events",
        };
      }
    });
  },
});

export const {
  selectDisplayFilter,
  populateEvents,
  nextEventsPage,
  prevEventsPage,
  goToEventsPage,
} = EventsSlice.actions;

export default EventsSlice.reducer;

export type EventCategorySliceType = ReturnType<typeof EventsSlice.reducer>;

export type { GroupNameByGroupID };
