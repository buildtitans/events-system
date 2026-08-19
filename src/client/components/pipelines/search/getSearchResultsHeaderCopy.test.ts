import type { SearchResult } from "@/src/lib/hooks/search/types";
import { getSearchResultsHeaderCopy } from "./getSearchResultsHeaderCopy";

const result = { kind: "event", data: {} } as SearchResult;

describe("getSearchResultsHeaderCopy", () => {
  it("describes the initial search state", () => {
    expect(getSearchResultsHeaderCopy("", { status: "initial" })).toEqual({
      heading: "Search for events and communities",
    });
  });

  it("describes a pending search", () => {
    expect(getSearchResultsHeaderCopy("react", { status: "pending" })).toEqual({
      heading: "Search Pending...",
    });
  });

  it("uses the empty-state message", () => {
    expect(
      getSearchResultsHeaderCopy("react", {
        status: "n/a",
        message: "0 results for submitted search terms",
      }),
    ).toEqual({ heading: "0 results for submitted search terms" });
  });

  it("describes a failed search", () => {
    expect(
      getSearchResultsHeaderCopy("react", {
        status: "failed",
        error: "Failed to retrieve results for those search terms",
      }),
    ).toEqual({ heading: "Failed to retrieve results" });
  });

  it("uses singular copy for one result", () => {
    expect(
      getSearchResultsHeaderCopy("react", {
        status: "ready",
        data: [result],
      }),
    ).toEqual({ heading: "1 Result for", emphasizedQuery: "react" });
  });

  it("uses plural copy for multiple results", () => {
    expect(
      getSearchResultsHeaderCopy("react", {
        status: "ready",
        data: [result, result],
      }),
    ).toEqual({ heading: "2 Results for", emphasizedQuery: "react" });
  });

  it("handles a ready state with no results defensively", () => {
    expect(
      getSearchResultsHeaderCopy("react", {
        status: "ready",
        data: [],
      }),
    ).toEqual({
      heading: "0 results for submitted search terms",
      emphasizedQuery: "react",
    });
  });
});
