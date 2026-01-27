import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import type { AlertMessages, AlertMessagesType, RequestStatus, SnackbarMessages } from "@/src/lib/types/types";
import { ValueOf } from "@trpc/server/unstable-core-do-not-import";

type MainContentTabType = 'Groups' | 'Events'

export type ActiveModal = 'new group' | 'create event' | null;

export type ActiveDrawer = 'create event' | null;

type AlertType = {
    action: AlertMessagesType["action"],
    kind: AlertMessagesType["kind"]
}

export type SnackbarStatusAndKind = {
    kind: keyof SnackbarMessages | null,
    status: RequestStatus
}


type RenderingInitialState = {
    mainContent: MainContentTabType,
    modal: ActiveModal,
    snackbar: SnackbarStatusAndKind,
    alert: AlertType,
    drawer: ActiveDrawer
};

const initialState: RenderingInitialState = {
    mainContent: "Events",
    modal: null,
    drawer: null,
    snackbar: {
        kind: null,
        status: 'idle'
    },
    alert: {
        action: null,
        kind: null,
    }
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
        enqueueDrawer: (state: RenderingInitialState, action: PayloadAction<ActiveDrawer>) => {
            state.drawer = action.payload
        },
        enqueueSnackbar: (state: RenderingInitialState, action: PayloadAction<SnackbarStatusAndKind>) => {
            state.snackbar = action.payload;
        },
        enqueueAlert: (state: RenderingInitialState, action: PayloadAction<AlertType>) => {
            state.alert = action.payload;
        }
    }
});



export const {
    chooseActiveTab,
    showModal,
    enqueueSnackbar,
    enqueueAlert,
    enqueueDrawer
} = RenderingSlice.actions;

export default RenderingSlice.reducer;

type RenderingSliceType = ReturnType<typeof RenderingSlice.reducer>;

export type {
    RenderingInitialState,
    RenderingSliceType,
    MainContentTabType,
    AlertType
};