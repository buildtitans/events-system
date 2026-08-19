import { SearchResultState } from "@/src/lib/hooks/search/types";
import { Box, Typography } from "@mui/material";

const headingSx = {
  pt: { xs: 2, sm: 2.5 },
  px: { xs: 0.5, sm: 0.75 },
  color: "rgba(255, 255, 255, 0.58)",
  fontSize: { xs: "0.9rem", sm: "1rem" },
  fontWeight: 600,
  letterSpacing: "-0.01em",
  lineHeight: 1.4,
};

const querySx = {
  color: "#ffffff",
  fontWeight: 700,
  overflowWrap: "anywhere",
};

type RenderSearchResultsHeaderProps = {
  query: string;
  results: SearchResultState;
};

export default function RenderSearchResultsHeader({
  query,
  results,
}: RenderSearchResultsHeaderProps) {
  switch (results.status) {
    case "ready": {
      return <ResultsHeader query={query} numResults={results.data.length} />;
    }
    case "n/a": {
      return (
        <ResultsHeaderFallback
          fallbackHeader={"0 results for submitted search terms"}
        />
      );
    }
    case "initial": {
      return (
        <ResultsHeaderFallback
          fallbackHeader={"Search for events and communities"}
        />
      );
    }
    case "pending": {
      return <ResultsHeaderFallback fallbackHeader={"Search Pending..."} />;
    }

    case "failed": {
      return (
        <ResultsHeaderFallback fallbackHeader={"Failed to retrieve results"} />
      );
    }
  }
}

function ResultsHeader({
  query,
  numResults,
}: {
  query: string;
  numResults: number;
}) {
  return (
    <Typography component="h1" sx={headingSx}>
      {getQueryHeaderPrefix(numResults)}
      <Box component="span" sx={querySx}>
        {` “${query}”`}
      </Box>
    </Typography>
  );
}

function ResultsHeaderFallback({
  fallbackHeader,
}: {
  fallbackHeader:
    | Extract<SearchResultState, { status: "n/a" }>["message"]
    | "Search for events and communities"
    | "Failed to retrieve results"
    | "Search Pending...";
}) {
  return (
    <Typography component="h1" sx={headingSx}>
      {fallbackHeader}
    </Typography>
  );
}

function getQueryHeaderPrefix(numResults: number): string {
  if (numResults === 0) {
    return "0 results for submitted search terms";
  } else if (numResults === 1) {
    return `1 Result for`;
  } else {
    return `${numResults} Results for`;
  }
}
