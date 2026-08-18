import {
  AutoCompleteSuggestions,
  SearchResultState,
} from "@/src/lib/hooks/search/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { querySuggestions, searchQuery } from "./thunks";

interface InitialState {
  suggestions: AutoCompleteSuggestions;
  results: SearchResultState;
  suggestionsRequestId: string;
  searchRequestId: string;
}

const initialState: InitialState = {
  suggestions: { status: "initial" },
  results: { status: "initial" },
  searchRequestId: "",
  suggestionsRequestId: "",
};

const AppSearchSlice = createSlice({
  name: "AppSearch",
  initialState,
  reducers: {
    getSuggestedItems: (
      state: InitialState,
      action: PayloadAction<AutoCompleteSuggestions>,
    ) => {
      state.suggestions = action.payload;
      state.suggestionsRequestId = "";
    },
    getSearchResults: (
      state: InitialState,
      action: PayloadAction<SearchResultState>,
    ) => {
      state.results = action.payload;
      state.searchRequestId = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(querySuggestions.pending, (state, action) => {
      state.suggestions = { status: "pending" };
      state.suggestionsRequestId = action.meta.requestId;
    });

    builder.addCase(querySuggestions.rejected, (state, action) => {
      if (state.suggestionsRequestId !== action.meta.requestId) return;

      state.suggestions = {
        status: "failed",
        error: "Failed to find suggestions for search terms",
      };
      state.suggestionsRequestId = "";
    });

    builder.addCase(querySuggestions.fulfilled, (state, action) => {
      if (state.suggestionsRequestId !== action.meta.requestId) return;

      const results = action.payload;

      if (!results) return;

      state.suggestionsRequestId = "";

      if (results.length === 0) {
        state.suggestions = {
          status: "n/a",
          message: "Your query had 0 Results",
        };
      } else {
        state.suggestions = { status: "ready", data: results };
      }
    });

    builder.addCase(searchQuery.pending, (state, action) => {
      state.results = { status: "pending" };
      state.searchRequestId = action.meta.requestId;
    });

    builder.addCase(searchQuery.rejected, (state, action) => {
      if (state.searchRequestId !== action.meta.requestId) return;

      state.results = {
        status: "failed",
        error: "Failed to retrieve results for those search terms",
      };
      state.searchRequestId = "";
    });

    builder.addCase(searchQuery.fulfilled, (state, action) => {
      if (state.searchRequestId !== action.meta.requestId) return;

      const results = action.payload;

      if (!results) return;

      state.searchRequestId = "";

      if (results.length === 0) {
        state.results = {
          status: "n/a",
          message: "0 results for submitted search terms",
        };
      } else {
        state.results = { status: "ready", data: results };
      }
    });
  },
});

export const { getSearchResults, getSuggestedItems } = AppSearchSlice.actions;

export default AppSearchSlice.reducer;
