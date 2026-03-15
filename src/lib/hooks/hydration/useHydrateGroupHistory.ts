"use client";
import { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getGroupHistory } from "../../store/slices/groups/OpenedGroupSlice";
import { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";

function sortByDate(events: EventsArraySchemaType): EventsArraySchemaType {
  const sorted = events.sort((a, b) => {
    const curr = new Date(a.starts_at);

    const next = new Date(b.starts_at);

    return next.getTime() - curr.getTime();
  });

  return sorted;
}

export const useHydrateGroupHisory = () => {
  const openedGroup = useSelector((s: RootState) => s.openGroup.group);
  const groupHistoryStatus = useSelector(
    (s: RootState) => s.openGroup.history.status,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (groupHistoryStatus !== "initial") return;
    if (openedGroup.status !== "ready") return;

    const executeHydrateGroupHistory = async () => {
      dispatch(getGroupHistory({ status: "pending" }));

      const res = await trpcClient.events.getGroupEvents.mutate(
        openedGroup.data.id,
      );

      if (res.length > 0) {
        const sortedBydate = sortByDate(res);

        dispatch(getGroupHistory({ status: "ready", data: sortedBydate }));
      } else {
        dispatch(
          getGroupHistory({
            status: "failed",
            error: "failed to get group history",
          }),
        );
      }
    };

    void executeHydrateGroupHistory();
  }, [openedGroup, groupHistoryStatus]);
};
