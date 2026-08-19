import RenderSearchResultsHeader from "@/src/client/components/pipelines/search/renderSearchResultsHeader";
import FadeIn from "@/src/client/components/ui/box/motionboxes/fadeIn";
import { SearchResultState } from "@/src/lib/hooks/search/types";

type ResultsForQueryProps = {
  query: string;
  results: SearchResultState;
};

export default function ResultsForQuery({
  query,
  results,
}: ResultsForQueryProps) {
  return (
    <FadeIn keyValue="results-for-query">
      <RenderSearchResultsHeader query={query} results={results} />
    </FadeIn>
  );
}
