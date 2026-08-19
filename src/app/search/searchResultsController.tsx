"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { searchQuery } from "@/src/lib/store/slices/search/thunks";
import { AsyncStateRenderer } from "@/src/client/components/pipelines/async/asyncStateRenderer";
import RenderSearchResults from "@/src/client/components/pipelines/search/renderSearchResults";
import SearchResultsEmptyFallback from "@/src/client/features/search/searchResultsEmptyFallback";
import { Container, Stack, Box } from "@mui/material";
import { SearchResultState } from "@/src/lib/hooks/search/types";
import { resetSearchResults } from "@/src/lib/store/slices/search/appSearchSlice";
import ResultsForQuery from "./resultsFor";
import Spinner from "@/src/client/components/ui/feedback/pending/spinner";

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
    <Container disableGutters sx={{ minHeight: "100dvh" }}>
      <Stack gap={2}>
        <ResultsForQuery query={normalizedQuery} results={visibleResults} />
        <AsyncStateRenderer
          state={visibleResults}
          pending={() => (
            <Box
              sx={{
                minHeight: { xs: "45dvh", md: "55dvh" },
                display: "grid",
                placeItems: "center",
              }}
            >
              <Spinner />
            </Box>
          )}
          empty={() => <SearchResultsEmptyFallback query={query} />}
        >
          {(state) => <RenderSearchResults results={state} />}
        </AsyncStateRenderer>
      </Stack>
    </Container>
  );
}
