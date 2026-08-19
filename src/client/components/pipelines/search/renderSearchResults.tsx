"use client";
import { lazy, Suspense, useMemo } from "react";
import EventSearchResultItemSkeleton from "@/src/client/features/search/eventSearchResultItemSkeleton";
import GroupSearchResultItemSkeleton from "@/src/client/features/search/groupSearchResultItemSkeleton";
import { SearchResult } from "@/src/lib/hooks/search/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { useRouter } from "next/navigation";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import { CategoryLookupType } from "@/src/lib/utils/helpers/categories/createCategoryLookup";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { seedCategoryMap } from "@/src/lib/utils/rendering/seedCategoryMap";
import { getCategoryName } from "@/src/lib/utils/rendering/getCategoryName";
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
  const categories = useSelector((s: RootState) => s.categories.categories);
  const categoryMap = useMemo(() => {
    return seedCategoryMap(categories);
  }, [categories]);

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
              categoryName={getCategoryName(
                result.data.category_id,
                categoryMap,
              )}
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
