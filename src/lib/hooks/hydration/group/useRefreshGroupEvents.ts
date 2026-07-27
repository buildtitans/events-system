"use client";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { refreshGroupEvents } from "@/src/lib/store/slices/groups/thunks";
import { useEffect } from "react";

export const useRefreshGroupEvents = () => {
  const { events, group } = useSelector(
    (s: RootState) => s.openGroup,
    shallowEqual,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (group.status !== "ready" || events.status !== "refreshing") return;

    const executeGroupEventsRefresh = async () => {
      await dispatch(refreshGroupEvents(group.data.id));
    };

    void executeGroupEventsRefresh();
  }, [dispatch, group, events.status]);
};
