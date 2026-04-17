"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import {
  populateEvents,
  selectDisplayFilter,
} from "@/src/lib/store/slices/events/EventsSlice";
import { EventsPages } from "../../store/slices/events/types";
import { trpcClient } from "@/src/trpc/trpcClient";
import type {
  ChangeActiveCategoryHook,
  FilterType,
} from "../../types/hooks/types";
import {
  curateUpcomingEventIds,
  UpcomingEventIds,
} from "../../utils/dates/curateUpcomingEventIds";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

type PopularEventsIds = EventSchemaType["id"][];

export const useChangeActiveCategory = (): ChangeActiveCategoryHook => {
  const hydrateStatus = useSelector(
    (s: RootState) => s.rendering.initialLoadStatus,
  );
  const status = useSelector((s: RootState) => s.events.eventPages.status);
  const [filter, setFilter] = useState<FilterType>("initial");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getUpcomingEvents = async (ids: UpcomingEventIds) => {
      const upcomingEvents = await trpcClient.events.eventsById.mutate(ids);

      dispatch(
        populateEvents({
          status: "ready",
          data: upcomingEvents,
        }),
      );
    };

    const executeGetUpcomingEvents = async (): Promise<void> => {
      const eventsPages = await trpcClient.events.allEventsLayout.mutate();

      const ids = curateUpcomingEventIds(eventsPages);

      if (ids.length === 0) {
        dispatch(
          populateEvents({
            status: "failed",
            error: "Couldn't find any events for that filter",
          }),
        );
        return;
      }
      await getUpcomingEvents(ids);
    };

    const getAllActiveEvents = async (): Promise<void> => {
      const allActiveEvents = await trpcClient.events.allEventsLayout.mutate();

      dispatch(
        populateEvents({
          status: "ready",
          data: allActiveEvents,
        }),
      );
    };

    const compilePopularEventIds = async (): Promise<PopularEventsIds> => {
      return await trpcClient.eventAttendants.getPopularEventIds.mutate();
    };

    const retrievePopularEvents = async (
      ids: PopularEventsIds,
    ): Promise<EventsPages> => {
      const events = await trpcClient.events.eventsById.mutate(ids);

      return events;
    };

    const getPopularEvents = async () => {
      const ids = await compilePopularEventIds();
      const popularEvents = await retrievePopularEvents(ids);
      dispatch(
        populateEvents({
          status: "ready",
          data: popularEvents,
        }),
      );
    };

    if (hydrateStatus !== "idle") return;
    if (filter === "initial") return;

    const executeFilterEvents = async (filter: FilterType) => {
      dispatch(populateEvents({ status: "pending" }));

      switch (filter) {
        case "All Events":
          await getAllActiveEvents();
          dispatch(selectDisplayFilter(filter));
          setFilter("initial");
          return;
        case "Popular Events":
          await getPopularEvents();
          dispatch(selectDisplayFilter(filter));
          setFilter("initial");
          return;

        case "Upcoming events":
          await executeGetUpcomingEvents();
          dispatch(selectDisplayFilter(filter));

          setFilter("initial");
          return;

        case "initial": {
          return;
        }
        default: {
          return;
        }
      }
    };

    void executeFilterEvents(filter);
  }, [hydrateStatus, filter, dispatch]);

  return {
    setFilter,
    eventStatus: status,
    mountStatus: hydrateStatus,
    pendingFilter: status === "pending",
  };
};
