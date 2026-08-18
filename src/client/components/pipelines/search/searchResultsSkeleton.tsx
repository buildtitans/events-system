import Stack from "@mui/material/Stack";
import EventSearchResultItemSkeleton from "@/src/client/features/search/eventSearchResultItemSkeleton";
import GroupSearchResultItemSkeleton from "@/src/client/features/search/groupSearchResultItemSkeleton";

export default function SearchResultsSkeleton() {
  return (
    <Stack gap={2} width="100%" role="status" aria-label="Loading search results">
      <EventSearchResultItemSkeleton />
      <GroupSearchResultItemSkeleton />
      <EventSearchResultItemSkeleton />
    </Stack>
  );
}
