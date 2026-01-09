import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";

type MainContentStatusType = 'Groups' | 'Events'

type RenderingInitialState = {
    mainContent: MainContentStatusType
};

const initialState: RenderingInitialState = {
    mainContent: "Events"
}

const RenderingSlice = createSlice({
    name: "Rendering",
    initialState: initialState,
    reducers: {
        chooseActiveTab: (state: RenderingInitialState, action: PayloadAction<RenderingInitialState["mainContent"]>) => {
            state.mainContent = action.payload
        }
    }
});


export const { chooseActiveTab } = RenderingSlice.actions;

export default RenderingSlice.reducer;

type RenderingSliceType = ReturnType<typeof RenderingSlice.reducer>;

export type {
    RenderingInitialState,
    RenderingSliceType,
    MainContentStatusType
};