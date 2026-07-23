import type { SyncDomainsType } from "@/src/lib/types/server/types";
import { AppBootState } from "@/src/lib/types/state/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initializeDomains = createAction<SyncDomainsType>(
  "app/initializeDomains",
);

export type InitialState = {
  hydration: AppBootState;
};

const initialState: InitialState = {
  hydration: { status: "initial" },
};

const BootStrapSlice = createSlice({
  name: "BootStrapSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      initializeDomains,
      (state: InitialState, action: PayloadAction<SyncDomainsType>) => {
        switch (action.payload.status) {
          case "rejected": {
            state.hydration.status = "failed";
            break;
          }
          case "fulfilled": {
            state.hydration.status = "ready";
            break;
          }

          default: {
            assertNever(action.payload);
          }
        }
      },
    );
  },
});

export type BootStrapSliceType = ReturnType<typeof BootStrapSlice.reducer>;

export default BootStrapSlice.reducer;
