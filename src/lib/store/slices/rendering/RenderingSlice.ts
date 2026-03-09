import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  AlertMessagesType,
  LoadingStatus,
  RequestStatus,
  SnackbarMessages,
  DomainStatus,
} from "@/src/lib/types/tokens/types";

type MainContentTabType =
  | "Upcoming Events"
  | "Local Events"
  | "Categories"
  | "Popular Events";

export type ActiveModal =
  | "confirm cancel"
  | "confirm signout"
  | "confirm leave group"
  | null;

export type ActiveDrawer =
  | "create event drawer"
  | "sign in drawer"
  | "event drawer"
  | "new group"
  | "sign up drawer"
  | null;

export type ActiveSidebar = "group" | "user" | null;

type AlertType = {
  action: AlertMessagesType["action"];
  kind: AlertMessagesType["kind"];
};

export type SnackbarStatusAndKind = {
  kind: keyof SnackbarMessages | null;
  status: RequestStatus;
};

type RenderingInitialState = {
  mainContent: MainContentTabType;
  initialLoadStatus: DomainStatus;
  modal: ActiveModal;
  snackbar: SnackbarStatusAndKind;
  alert: AlertType;
  drawer: ActiveDrawer;
  sidebar: ActiveSidebar;
};

const initialState: RenderingInitialState = {
  mainContent: "Upcoming Events",
  initialLoadStatus: "initial",
  modal: null,
  drawer: null,
  snackbar: {
    kind: null,
    status: "idle",
  },
  alert: {
    action: null,
    kind: null,
  },
  sidebar: null,
};

const RenderingSlice = createSlice({
  name: "Rendering",
  initialState: initialState,
  reducers: {
    chooseActiveTab: (
      state: RenderingInitialState,
      action: PayloadAction<RenderingInitialState["mainContent"]>,
    ) => {
      state.mainContent = action.payload;
    },
    showModal: (
      state: RenderingInitialState,
      action: PayloadAction<ActiveModal>,
    ) => {
      state.modal = action.payload;
    },
    enqueueDrawer: (
      state: RenderingInitialState,
      action: PayloadAction<ActiveDrawer>,
    ) => {
      state.drawer = action.payload;
    },
    enqueueSidebar: (
      state: RenderingInitialState,
      action: PayloadAction<ActiveSidebar>,
    ) => {
      state.sidebar = action.payload;
    },
    enqueueSnackbar: (
      state: RenderingInitialState,
      action: PayloadAction<SnackbarStatusAndKind>,
    ) => {
      state.snackbar = action.payload;
    },
    enqueueAlert: (
      state: RenderingInitialState,
      action: PayloadAction<AlertType>,
    ) => {
      state.alert = action.payload;
    },
    signalDomainStatus: (
      state: RenderingInitialState,
      action: PayloadAction<LoadingStatus>,
    ) => {
      state.initialLoadStatus = action.payload;
    },
  },
});

export const {
  chooseActiveTab,
  showModal,
  enqueueSnackbar,
  enqueueAlert,
  enqueueDrawer,
  enqueueSidebar,
  signalDomainStatus,
} = RenderingSlice.actions;

export default RenderingSlice.reducer;

type RenderingSliceType = ReturnType<typeof RenderingSlice.reducer>;

export type {
  RenderingInitialState,
  RenderingSliceType,
  MainContentTabType,
  AlertType,
};
