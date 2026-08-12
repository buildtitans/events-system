"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { hydrateGroupHistory } from "@/src/lib/store/slices/groups/thunks";

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
      await dispatch(hydrateGroupHistory(openedGroup.data.id));
    };

    void executeHydrateGroupHistory();
  }, [openedGroup, groupHistoryStatus, dispatch]);
};
