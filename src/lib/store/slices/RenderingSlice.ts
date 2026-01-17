import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
<<<<<<< HEAD
import type { RequestStatus } from "@/src/lib/types/types";
=======
<<<<<<< Updated upstream
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)

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
<<<<<<< HEAD
    mainContent: "Events",
    loginStatus: 'idle',
    logoutStatus: 'idle',
    newGroupStatus: "idle",
    modal: null
=======
    mainContent: "Events"
=======
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
>>>>>>> Stashed changes
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
}

const RenderingSlice = createSlice({
    name: "Rendering",
    initialState: initialState,
    reducers: {
        chooseActiveTab: (state: RenderingInitialState, action: PayloadAction<RenderingInitialState["mainContent"]>) => {
            state.mainContent = action.payload
<<<<<<< HEAD
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
=======
<<<<<<< Updated upstream
=======
        },
        showModal: (state: RenderingInitialState, action: PayloadAction<ActiveModal>) => {
            state.modal = action.payload;
        },

        enqueueSnackbar: (state: RenderingInitialState, action: PayloadAction<SnackbarStatusAndKind>) => {
            state.snackbar = action.payload;
>>>>>>> Stashed changes
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
        }

    }
});


<<<<<<< HEAD
export const { chooseActiveTab, currentLoginStatus, currentLougoutStatus, showModal, changeNewGroupStatus } = RenderingSlice.actions;
=======
<<<<<<< Updated upstream
export const { chooseActiveTab } = RenderingSlice.actions;
=======
export const {
    chooseActiveTab,
    showModal,
    enqueueSnackbar
} = RenderingSlice.actions;
>>>>>>> Stashed changes
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)

export default RenderingSlice.reducer;

type RenderingSliceType = ReturnType<typeof RenderingSlice.reducer>;

export type {
    RenderingInitialState,
    RenderingSliceType,
    MainContentTabType
};