"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { searchQuery } from "@/src/lib/store/slices/search/thunks";
import { AsyncStateRenderer } from "@/src/client/components/pipelines/async/asyncStateRenderer";
import RenderSearchResults from "@/src/client/components/pipelines/search/renderSearchResults";
import SearchResultsEmptyFallback from "@/src/client/features/search/searchResultsEmptyFallback";
import { Container, Stack } from "@mui/material";
import { SearchResultState } from "@/src/lib/hooks/search/types";
import { resetSearchResults } from "@/src/lib/store/slices/search/appSearchSlice";
import ResultsForQuery from "./resultsFor";

export default function SearchResultsController({ query }: { query: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const results = useSelector((s: RootState) => s.search.results);
  const resultsQuery = useSelector((s: RootState) => s.search.resultsQuery);
  const normalizedQuery = query.trim();
  const visibleResults: SearchResultState =
    resultsQuery === normalizedQuery ? results : { status: "pending" };

  useEffect(() => {
    if (!normalizedQuery) {
      dispatch(resetSearchResults());
      return;
    }

    void dispatch(searchQuery({ query: normalizedQuery }));
  }, [dispatch, normalizedQuery]);

  return (
    <Container disableGutters>
      <Stack gap={2}>
        {normalizedQuery && <ResultsForQuery query={normalizedQuery} />}
        <AsyncStateRenderer
          state={visibleResults}
          empty={() => <SearchResultsEmptyFallback query={query} />}
        >
          {(state) => <RenderSearchResults results={state} />}
        </AsyncStateRenderer>
      </Stack>
    </Container>
  );
}
