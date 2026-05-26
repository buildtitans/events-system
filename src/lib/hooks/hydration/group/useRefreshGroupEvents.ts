"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  getFlattenedGroupEvents,
  getGroupEvents,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect } from "react";
import { syncEventsForGroup } from "@/src/lib/store/sync/syncEventsForGroup";
import { trpcClient } from "@/src/trpc/trpcClient";

export const useRefreshGroupEvents = () => {
  const groupEvents = useSelector((s: RootState) => s.openGroup.events);
  const dispatch = useDispatch<AppDispatch>();
  const group = useSelector((s: RootState) => s.openGroup.group);

  useEffect(() => {
    if (group.status !== "ready" || groupEvents.status !== "refreshing") return;

    const executeGroupEventsRefresh = async () => {
      dispatch(getFlattenedGroupEvents({ status: "pending" }));

      const refreshed = await syncEventsForGroup(group.data.id);
      const flattened = await trpcClient.events.getFlattenedGroupEvents.mutate(
        group.data.id,
      );

      if (refreshed !== null && refreshed.length > 0) {
        dispatch(
          getGroupEvents({
            status: "ready",
            data: refreshed,
          }),
        );
        dispatch(getFlattenedGroupEvents({ status: "ready", data: flattened }));
      } else if (refreshed?.length === 0) {
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
      } else {
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
      }
    };

    void executeGroupEventsRefresh();
  }, [dispatch, group, groupEvents.status]);
};
