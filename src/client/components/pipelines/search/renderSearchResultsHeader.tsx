import type { SearchResultState } from "@/src/lib/hooks/search/types";
import { Box, Typography } from "@mui/material";
import { getSearchResultsHeaderCopy } from "./getSearchResultsHeaderCopy";

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
  const copy = getSearchResultsHeaderCopy(query, results);

  return (
    <Typography component="h1" sx={headingSx}>
      {copy.heading}
      {copy.emphasizedQuery && (
        <Box component="span" sx={querySx}>
          {` “${copy.emphasizedQuery}”`}
        </Box>
      )}
    </Typography>
  );
}
