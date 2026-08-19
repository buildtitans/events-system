jest.mock("./thunks", () => {
  const { createAsyncThunk } = jest.requireActual(
    "@reduxjs/toolkit",
  ) as typeof import("@reduxjs/toolkit");

  return {
    querySuggestions: createAsyncThunk(
      "AppSearchSlice/querySuggestions",
      async () => [],
    ),
    searchQuery: createAsyncThunk(
      "AppSearchSlice/searchQuery",
      async () => [],
    ),
  };
});

import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import appSearchReducer, { resetSearchResults } from "./appSearchSlice";
import { searchQuery } from "./thunks";

const event = {
  id: "event-1",
  title: "React Night",
} as EventSchemaType;

const result = { kind: "event", data: event } as const;

describe("AppSearchSlice search results", () => {
  it("stores the normalized query and request ID when a search begins", () => {
    const state = appSearchReducer(
      undefined,
      searchQuery.pending("request-1", { query: "  react  " }),
    );

    expect(state.results).toEqual({ status: "pending" });
    expect(state.resultsQuery).toBe("react");
    expect(state.searchRequestId).toBe("request-1");
  });

  it("stores results from the current fulfilled request", () => {
    const pendingState = appSearchReducer(
      undefined,
      searchQuery.pending("request-1", { query: "react" }),
    );

    const state = appSearchReducer(
      pendingState,
      searchQuery.fulfilled([result], "request-1", { query: "react" }),
    );

    expect(state.results).toEqual({ status: "ready", data: [result] });
    expect(state.resultsQuery).toBe("react");
    expect(state.searchRequestId).toBe("");
  });

  it("stores an empty state when the current request returns no results", () => {
    const pendingState = appSearchReducer(
      undefined,
      searchQuery.pending("request-1", { query: "missing" }),
    );

    const state = appSearchReducer(
      pendingState,
      searchQuery.fulfilled([], "request-1", { query: "missing" }),
    );

    expect(state.results).toEqual({
      status: "n/a",
      message: "0 results for submitted search terms",
    });
    expect(state.searchRequestId).toBe("");
  });

  it("stores a failure from the current rejected request", () => {
    const pendingState = appSearchReducer(
      undefined,
      searchQuery.pending("request-1", { query: "react" }),
    );

    const state = appSearchReducer(
      pendingState,
      searchQuery.rejected(
        new Error("network unavailable"),
        "request-1",
        { query: "react" },
      ),
    );

    expect(state.results).toEqual({
      status: "failed",
      error: "Failed to retrieve results for those search terms",
    });
    expect(state.searchRequestId).toBe("");
  });

  it("ignores a stale response after a newer search begins", () => {
    const firstPendingState = appSearchReducer(
      undefined,
      searchQuery.pending("request-1", { query: "react" }),
    );
    const secondPendingState = appSearchReducer(
      firstPendingState,
      searchQuery.pending("request-2", { query: "typescript" }),
    );

    const state = appSearchReducer(
      secondPendingState,
      searchQuery.fulfilled([result], "request-1", { query: "react" }),
    );

    expect(state.results).toEqual({ status: "pending" });
    expect(state.resultsQuery).toBe("typescript");
    expect(state.searchRequestId).toBe("request-2");
  });

  it("resets result data and request metadata", () => {
    const pendingState = appSearchReducer(
      undefined,
      searchQuery.pending("request-1", { query: "react" }),
    );

    expect(appSearchReducer(pendingState, resetSearchResults())).toMatchObject({
      results: { status: "initial" },
      resultsQuery: "",
      searchRequestId: "",
    });
  });
});
