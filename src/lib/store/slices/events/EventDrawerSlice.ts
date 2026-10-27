import { createSlice } from "@reduxjs/toolkit";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import { AsyncState } from "@/src/lib/types/state/types";
import { hydrateEventDrawer, updateRSVP } from "./thunks";

export type OpenedEventState = AsyncState<
  HydratedEventSchemaType,
  "Event not found"
>;

type InitialState = {
  event: OpenedEventState;
};

const initialState: InitialState = {
  event: { status: "initial" },
};

const EventDrawerSlice = createSlice({
  name: "EventDrawer",
  initialState: initialState,
  reducers: {
    closeEventDrawer: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(updateRSVP.fulfilled, (state, action) => {
      if (state.event.status !== "ready") {
        return;
      }
      if (state.event.data.event.id !== action.payload.updated.event_id) {
        return;
      }

      state.event.data.meta.user.status = action.payload.updated.status;
      state.event.data.meta.event.attendants = action.payload.headCount;
    });

    builder.addCase(hydrateEventDrawer.rejected, (state: InitialState) => {
      state.event = {
        status: "failed",
        error: "Failed to hydrate event drawer",
      };
    });
    builder.addCase(
      hydrateEventDrawer.fulfilled,
      (state: InitialState, action) => {
        state.event = { status: "ready", data: action.payload };
      },
    );

    builder.addCase(hydrateEventDrawer.pending, (state: InitialState) => {
      state.event = { status: "pending" };
    });
  },
});

export type EventDrawerSliceType = ReturnType<typeof EventDrawerSlice.reducer>;

export const { closeEventDrawer } = EventDrawerSlice.actions;

export default EventDrawerSlice.reducer;
