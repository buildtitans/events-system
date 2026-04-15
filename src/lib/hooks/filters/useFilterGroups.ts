import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  changeDisplayedGroupFilter,
  changeLandingGroupsTab,
} from "../../store/slices/groups/GroupsSlice";
import type { GroupsFilter } from "../../store/slices/groups/types";
import { useEffect, useState } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { chunkGroupsIntoPages } from "../../utils/helpers/chunk/chunkGroupsIntoPages";

type FilterGroupsHook = {
  handleFilterSelect: (option: GroupsFilter) => void;
  filter: GroupsFilter;
};

export const useFilterGroups = (): FilterGroupsHook => {
  const [filter, setFilter] = useState<GroupsFilter>("all");
  const dispatch = useDispatch<AppDispatch>();

  const handleFilterSelect = (option: GroupsFilter) => {
    setFilter((current) => (current === option ? current : option));
  };

  useEffect(() => {
    let cancelled = false;

    const executeFilterGroups = async () => {
      dispatch(changeLandingGroupsTab({ status: "pending" }));

      try {
        const groups =
          filter === "all"
            ? await trpcClient.groups.list.mutate()
            : await trpcClient.groups.popularGroups.mutate();

        if (cancelled) return;

        dispatch(
          changeLandingGroupsTab({
            status: "ready",
            data: chunkGroupsIntoPages(groups),
          }),
        );

        dispatch(changeDisplayedGroupFilter(filter));
      } catch (err) {
        console.error(err);
        dispatch(
          changeLandingGroupsTab({
            status: "failed",
            error: "Failed to retrieve groups",
          }),
        );
      }
    };

    void executeFilterGroups();

    return () => {
      cancelled = true;
    };
  }, [filter, dispatch]);

  return {
    handleFilterSelect,
    filter,
  };
};
