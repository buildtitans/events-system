import SearchResultsController from "./searchResultsController";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return <SearchResultsController query={q} />;
}
