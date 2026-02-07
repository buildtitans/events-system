import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventsPages } from "../EventsSlice";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { LoadingStatus } from "@/src/lib/types/tokens/types";
import { syncOpenedGroup } from "../../sync/syncOpenedGroup";

//TODO: finish setting up unified slice for hydrated group (in @/src/app/group/[groupSlug]/page.tsx)

type InitialState = {
    group: GroupSchemaType | null,
    events: EventsPages,
    syncStatus: LoadingStatus
};



const initialState: InitialState = {
    group: null,
    events: [],
    syncStatus: "idle"
};


const OpenedGroupSlice = createSlice({
    name: "OpenedGroup",
    initialState: initialState,
    reducers: {

        getGroupEvents: (state: InitialState, action: PayloadAction<EventsPages>) => {
            state.events = action.payload
        },
        groupOpened: (state: InitialState, action: PayloadAction<GroupSchemaType>) => {
            state.group = action.payload
        },

        syncOpenedGroupStatus: (state: InitialState, action: PayloadAction<LoadingStatus>) => {
            state.syncStatus = action.payload;
        },

    }
});

export const {
    getGroupEvents,
    groupOpened,
    syncOpenedGroupStatus
} = OpenedGroupSlice.actions;

export type OpenedGroupSliceType = ReturnType<typeof OpenedGroupSlice.reducer>;

export default OpenedGroupSlice.reducer;