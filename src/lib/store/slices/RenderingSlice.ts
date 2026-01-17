import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import type { RequestStatus, SnackbarMessages } from "@/src/lib/types/types";

type MainContentTabType = 'Groups' | 'Events'

export type ActiveModal = 'new group' | null;

export type SnackbarStatusAndKind = {
    kind: keyof SnackbarMessages | null,
    status: RequestStatus
}


type RenderingInitialState = {
    mainContent: MainContentTabType,
    modal: ActiveModal,
    snackbar: SnackbarStatusAndKind
};







const initialState: RenderingInitialState = {
    mainContent: "Events",
    modal: null,
    snackbar: { kind: null, status: 'idle' }
}

const RenderingSlice = createSlice({
    name: "Rendering",
    initialState: initialState,
    reducers: {
        chooseActiveTab: (state: RenderingInitialState, action: PayloadAction<RenderingInitialState["mainContent"]>) => {
            state.mainContent = action.payload
        },
        showModal: (state: RenderingInitialState, action: PayloadAction<ActiveModal>) => {
            state.modal = action.payload;
        },
        enqueueSnackbar: (state: RenderingInitialState, action: PayloadAction<SnackbarStatusAndKind>) => {
            state.snackbar = action.payload;
        }
    }
});



export const {
    chooseActiveTab,
    showModal,
    enqueueSnackbar
} = RenderingSlice.actions;

export default RenderingSlice.reducer;

type RenderingSliceType = ReturnType<typeof RenderingSlice.reducer>;

export type {
    RenderingInitialState,
    RenderingSliceType,
    MainContentTabType
};