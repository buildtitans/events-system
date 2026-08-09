"use client";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import {
  populateEvents,
  selectDisplayFilter,
} from "@/src/lib/store/slices/events/EventsSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import type { ChangeActiveCategoryHook } from "@/src/lib/types/hooks/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import {
  EventFilterService,
  FilterResults,
} from "@/src/lib/store/services/filter/eventFilterService";
import { EventDisplayFilter } from "@/src/lib/store/slices/events/types";

type HandleFilterResultsArgs = {
  filter: EventDisplayFilter;
  results: FilterResults;
};

export const useChangeActiveCategory = (): ChangeActiveCategoryHook => {
  const status = useSelector((s: RootState) => s.events.eventPages.status);
  const dispatch = useDispatch<AppDispatch>();
  const service = useMemo(() => new EventFilterService(trpcClient), []);

  const handleFilterResults = useCallback(
    ({ filter, results }: HandleFilterResultsArgs) => {
      dispatch(selectDisplayFilter(filter));

      if (results.ok) {
        dispatch(populateEvents({ status: "ready", data: results.events }));
        return;
      }
      dispatch(populateEvents({ status: "failed", error: results.error }));
    },
    [dispatch],
  );

  const filterFor = useCallback(
    async (filter: EventDisplayFilter) => {
      dispatch(populateEvents({ status: "pending" }));

      switch (filter) {
        case "All Events": {
          return handleFilterResults({ filter, results: await service.all() });
        }
        case "Popular Events": {
          return handleFilterResults({
            filter,
            results: await service.popular(),
          });
        }
        case "Upcoming events": {
          return handleFilterResults({
            filter,
            results: await service.upcoming(),
          });
        }
        default: {
          return assertNever(filter);
        }
      }
    },
    [dispatch, handleFilterResults, service],
  );

  return {
    filterFor,
    eventStatus: status,
    pendingFilter: status === "pending",
  };
};
