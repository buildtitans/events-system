import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SearchLookupType } from "./types";

type InitialState = {
  lookup: SearchLookupType;
};

const initialState: InitialState = {
  lookup: { status: "initial" },
};

const SearchBarSlice = createSlice({
  name: "Landing/Search",
  initialState: initialState,
  reducers: {
    hydrateLookupMap: (
      state: InitialState,
      action: PayloadAction<SearchLookupType>,
    ) => {
      state.lookup = action.payload;
    },
  },
});

export const { hydrateLookupMap } = SearchBarSlice.actions;

export default SearchBarSlice.reducer;

export type SearchBarSliceType = ReturnType<typeof SearchBarSlice.reducer>;
