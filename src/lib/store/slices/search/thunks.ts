import { createAsyncThunk } from "@reduxjs/toolkit";
import type { GetThunkAPI, AsyncThunkConfig } from "@reduxjs/toolkit";
import { trpcClient } from "@/src/trpc/trpcClient";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

type SuggestionQueryParams = {
  query: string;

};

type SearchAppParams = {
  query: string;
};

export const querySuggestions = createAsyncThunk(
  "AppSearchSlice/querySuggestions",
  async (
    params: SuggestionQueryParams,
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    try {
      const results = await trpcClient.discovery.app.suggestions.query(params.query);

      return results;
    } catch (err) {
      logCaughtError("", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const searchQuery = createAsyncThunk(
  "AppSearchSlice/searchQuery",
  async (params: SearchAppParams, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      const results = await trpcClient.discovery.app.search.query(params.query);

      return results;
    } catch (err) {
      logCaughtError("AppSearchSlice.searchQuery()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);
