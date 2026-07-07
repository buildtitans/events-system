"use client";
import { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import {
  getGroupHistory,
  getPastEventsAttendanceRecords,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { sortByDate } from "@/src/lib/utils/helpers/sort/sortByDate";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

export const useHydrateGroupHistory = () => {
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

      try {
        const { pastEventsRecords, history } =
          await trpcClient.events.select.history.mutate(openedGroup.data.id);

        if (history.length > 0 && pastEventsRecords) {
          const sortedBydate = sortByDate(history);

          dispatch(getGroupHistory({ status: "ready", data: sortedBydate }));
          dispatch(getPastEventsAttendanceRecords(pastEventsRecords));
        } else {
          dispatch(
            getGroupHistory({
              status: "n/a",
              message: "No history to display",
            }),
          );
        }
      } catch (err) {
        logCaughtError(
          "hook/useHydrateGroupHistory.executeHydrateGroupHistory",
          err,
        );
        dispatch(
          getGroupHistory({
            status: "failed",
            error: "failed to get group history",
          }),
        );
      }
    };

    void executeHydrateGroupHistory();
  }, [openedGroup, groupHistoryStatus, dispatch]);
};
