"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { EventsPages } from "@/src/lib/store/slices/events/types";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  getFlattenedGroupEvents,
  getGroupEvents,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect } from "react";
import { syncEventsForGroup } from "@/src/lib/store/sync/syncEventsForGroup";
import { trpcClient } from "@/src/trpc/trpcClient";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

export const useRefreshGroupEvents = () => {
  const groupEvents = useSelector((s: RootState) => s.openGroup.events);
  const dispatch = useDispatch<AppDispatch>();
  const group = useSelector((s: RootState) => s.openGroup.group);

  useEffect(() => {
    if (group.status !== "ready" || groupEvents.status !== "refreshing") return;

    const dispatchSuccess = ({
      refreshedEventsLayout,
      flattenedEvents,
    }: {
      refreshedEventsLayout: EventsPages;
      flattenedEvents: EventSchemaType[];
    }) => {
      dispatch(
        getGroupEvents({ status: "ready", data: refreshedEventsLayout }),
      );
      dispatch(
        getFlattenedGroupEvents({ status: "ready", data: flattenedEvents }),
      );
    };

    const dispatchEmptyEvents = () => {
      dispatch(
        getGroupEvents({
          status: "warning",
          message: "No events have been scheduled for this group",
        }),
      );

      dispatch(
        getFlattenedGroupEvents({
          status: "n/a",
          message: "No Events held for this group",
        }),
      );
    };

    const dispatchRefreshFailed = () => {
      dispatch(
        getGroupEvents({
          status: "failed",
          error: "Error hydrating events for opened group",
        }),
      );

      dispatch(
        getFlattenedGroupEvents({
          status: "failed",
          error: "Error hydrating schedule for opened group",
        }),
      );
    };

    const executeGroupEventsRefresh = async () => {
      dispatch(getFlattenedGroupEvents({ status: "pending" }));

      try {
        const refreshedEventsLayout = await syncEventsForGroup(group.data.id);
        const flattenedEvents =
          await trpcClient.events.getFlattenedGroupEvents.mutate(group.data.id);

        if (refreshedEventsLayout.length > 0) {
          dispatchSuccess({ refreshedEventsLayout, flattenedEvents });
          return;
        }

        dispatchEmptyEvents();
      } catch (err) {
        logCaughtError(
          "hook/useRefreshGroupEvents.executeGroupEventsRefresh",
          err,
        );

        dispatchRefreshFailed();
      }
    };

    void executeGroupEventsRefresh();
  }, [dispatch, group, groupEvents.status]);
};
