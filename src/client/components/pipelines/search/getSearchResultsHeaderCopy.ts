import type { SearchResultState } from "@/src/lib/hooks/search/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

export type SearchResultsHeaderCopy = {
  heading: string;
  emphasizedQuery?: string;
};

export function getSearchResultsHeaderCopy(
  query: string,
  results: SearchResultState,
): SearchResultsHeaderCopy {
  switch (results.status) {
    case "initial":
      return { heading: "Search for events and communities" };
    case "pending":
      return { heading: "Search Pending..." };
    case "n/a":
      return { heading: results.message };
    case "failed":
      return { heading: "Failed to retrieve results" };
    case "ready": {
      const numResults = results.data.length;
      const heading =
        numResults === 0
          ? "0 results for submitted search terms"
          : numResults === 1
            ? "1 Result for"
            : `${numResults} Results for`;

      return { heading, emphasizedQuery: query };
    }

    default: {
      return assertNever(results);
    }
  }
}
