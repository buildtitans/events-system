import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventsPages } from "../events/EventsSlice";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { LoadingStatus } from "@/src/lib/types/tokens/types";

export type GroupHydrated = { status: "idle" }
    | { status: "pending" }
    | { status: "failed", error: "Group hydration error" }
    | { status: "ready", data: GroupSchemaType };

export type HydratedEventsForOpenedGroup = { status: "initial" } | { status: "idle" }
    | { status: "pending" }
    | { status: "refreshing" }
    | { status: "warning", message: "No events have been scheduled for this group" }
    | { status: "failed", error: "Error hydrating events for opened group" }
    | { status: "ready", data: EventsPages };

type InitialState = {
    group: GroupHydrated,
    events: HydratedEventsForOpenedGroup,
    syncStatus: LoadingStatus
};

const initialState: InitialState = {
    group: { status: "idle" },
    events: { status: "idle" },
    syncStatus: "idle"
};


const OpenedGroupSlice = createSlice({
    name: "OpenedGroup",
    initialState: initialState,
    reducers: {

        getGroupEvents: (state: InitialState, action: PayloadAction<HydratedEventsForOpenedGroup>) => {
            state.events = action.payload
        },
        groupOpened: (state: InitialState, action: PayloadAction<GroupHydrated>) => {
            state.group = action.payload
        },

        groupEventsStatus: (state: InitialState, action: PayloadAction<LoadingStatus>) => {
            state.syncStatus = action.payload;
        },

    }
});

export const {
    getGroupEvents,
    groupOpened,
    groupEventsStatus
} = OpenedGroupSlice.actions;

export type OpenedGroupSliceType = ReturnType<typeof OpenedGroupSlice.reducer>;

export default OpenedGroupSlice.reducer;