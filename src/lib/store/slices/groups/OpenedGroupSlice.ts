import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventsPages } from "../EventsSlice";
import { GroupSchemaType } from "@/src/schemas/groupSchema";

//TODO: finish setting up unified slice for hydrated group (in @/src/app/group/[groupSlug]/page.tsx)

type InitialState = {
    group: GroupSchemaType | null,
    events: EventsPages
};



const initialState: InitialState = {
    group: null,
    events: []
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

    }
});

export const {
    getGroupEvents,
    groupOpened
} = OpenedGroupSlice.actions;

export type OpenedGroupSliceType = ReturnType<typeof OpenedGroupSlice.reducer>;

export default OpenedGroupSlice.reducer;