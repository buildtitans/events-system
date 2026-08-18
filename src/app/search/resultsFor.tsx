import FadeIn from "@/src/client/components/ui/box/motionboxes/fadeIn";
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

export default function ResultsForQuery({ query }: { query: string }) {
  return (
    <FadeIn keyValue="results-for-query">
      <Typography component="h1" sx={headingSx}>
        Results for
        <Box component="span" sx={querySx}>
          {` “${query}”`}
        </Box>
      </Typography>
    </FadeIn>
  );
}
