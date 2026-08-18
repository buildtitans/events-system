"use client";
import { lazy, Suspense } from "react";
import EventSearchResultItemSkeleton from "@/src/client/features/search/eventSearchResultItemSkeleton";
import GroupSearchResultItemSkeleton from "@/src/client/features/search/groupSearchResultItemSkeleton";
import { SearchResult } from "@/src/lib/hooks/search/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { useRouter } from "next/navigation";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import { CategoryLookupType } from "@/src/lib/utils/helpers/categories/createCategoryLookup";
const EventSearchResultItem = lazy(
  () => import("@/src/client/features/search/eventSearchResultItem"),
);
const GroupSearchResultItem = lazy(
  () => import("@/src/client/features/search/groupSearchResultItem"),
);

type RenderSearchResultsProps = {
  results: SearchResult[];
  categoryLookup?: CategoryLookupType;
};

export default function RenderSearchResults({
  results,
}: RenderSearchResultsProps) {
  const { handleOpenEvent } = useSelectEvent();
  const router = useRouter();

  return results.map((result) => {
    switch (result.kind) {
      case "event": {
        return (
          <Suspense
            key={`event-${result.data.id}`}
            fallback={<EventSearchResultItemSkeleton />}
          >
            <EventSearchResultItem
              event={result.data}
              onAction={handleOpenEvent}
            />
          </Suspense>
        );
      }
      case "group": {
        return (
          <Suspense
            key={`group-${result.data.id}`}
            fallback={<GroupSearchResultItemSkeleton />}
          >
            <GroupSearchResultItem
              group={result.data}
              onAction={(slug) => router.push(`/group/${slug}`)}
            />
          </Suspense>
        );
      }

      default: {
        return assertNever(result);
      }
    }
  });
}
