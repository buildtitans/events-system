"use client";
import { lazy, Suspense } from "react";
import EventSearchResultItemSkeleton from "@/src/client/features/search/eventSearchResultItemSkeleton";
import GroupSearchResultItemSkeleton from "@/src/client/features/search/groupSearchResultItemSkeleton";
import { SearchResult } from "@/src/lib/hooks/search/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { useRouter } from "next/navigation";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";

const EventSearchResultItem = lazy(
  () => import("@/src/client/features/search/eventSearchResultItem"),
);
const GroupSearchResultItem = lazy(
  () => import("@/src/client/features/search/groupSearchResultItem"),
);

type RenderSearchResultsProps = {
  results: SearchResult[];

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
            key={`event-${result.data.event.id}`}
            fallback={<EventSearchResultItemSkeleton />}
          >
            <EventSearchResultItem
              event={result.data.event}
              groupName={result.data.meta.group.group_name}
              groupLocation={result.data.meta.group.group_location}
              onAction={handleOpenEvent}
            />
          </Suspense>
        );
      }
      case "group": {
        return (
          <Suspense
            key={`group-${result.data.group.id}`}
            fallback={<GroupSearchResultItemSkeleton />}
          >
            <GroupSearchResultItem
              categoryName={result.data.meta.category_name}
              group={result.data.group}
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
