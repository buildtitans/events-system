"use client";
import { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getGroupHistory } from "../../store/slices/groups/OpenedGroupSlice";

export const useHydrateGroupHisory = () => {
  const openedGroup = useSelector((s: RootState) => s.openGroup.group);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (openedGroup.status !== "ready") return;

    const executeHydrateGroupHistory = async () => {
      dispatch(getGroupHistory({ status: "pending" }));

      const res = await trpcClient.events.groupHistory.mutate(
        openedGroup.data.id,
      );

      if (res.length > 0) {
        dispatch(getGroupHistory({ status: "ready", data: res }));
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
  }, [openedGroup]);
};
