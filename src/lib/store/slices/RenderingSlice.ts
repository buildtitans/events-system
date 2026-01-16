import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import type { RequestStatus } from "@/src/lib/types/types";

type MainContentTabType = 'Groups' | 'Events'

export type ActiveModal = 'new group' | null;

type RenderingInitialState = {
    mainContent: MainContentTabType,
    loginStatus: RequestStatus,
    logoutStatus: RequestStatus,
    newGroupStatus: RequestStatus,
    modal: ActiveModal
};

const initialState: RenderingInitialState = {
    mainContent: "Events",
    loginStatus: 'idle',
    logoutStatus: 'idle',
    newGroupStatus: "idle",
    modal: null
}

const RenderingSlice = createSlice({
    name: "Rendering",
    initialState: initialState,
    reducers: {
        chooseActiveTab: (state: RenderingInitialState, action: PayloadAction<RenderingInitialState["mainContent"]>) => {
            state.mainContent = action.payload
        },
        currentLougoutStatus: (state: RenderingInitialState, action: PayloadAction<RequestStatus>) => {
            state.logoutStatus = action.payload;
        },
        currentLoginStatus: (state: RenderingInitialState, action: PayloadAction<RequestStatus>) => {
            state.loginStatus = action.payload;
        },
        changeNewGroupStatus: (state: RenderingInitialState, action: PayloadAction<RequestStatus>) => {
            state.newGroupStatus = action.payload
        },
        showModal: (state: RenderingInitialState, action: PayloadAction<ActiveModal>) => {
            state.modal = action.payload;
        }
    }
});


export const { chooseActiveTab, currentLoginStatus, currentLougoutStatus, showModal, changeNewGroupStatus } = RenderingSlice.actions;

export default RenderingSlice.reducer;

type RenderingSliceType = ReturnType<typeof RenderingSlice.reducer>;

export type {
    RenderingInitialState,
    RenderingSliceType,
    MainContentTabType
};