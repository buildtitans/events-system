import { createAsyncThunk } from "@reduxjs/toolkit";
import type { GetThunkAPI, AsyncThunkConfig } from "@reduxjs/toolkit";
import { AppSearchService } from "../../services/search/appSearchService";
import { trpcClient } from "@/src/trpc/trpcClient";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

const service = new AppSearchService(trpcClient);

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
      const results = await service.suggestions(params.query);

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
      const results = await service.search(params.query);

      return results;
    } catch (err) {
      logCaughtError("AppSearchSlice.searchQuery()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);
