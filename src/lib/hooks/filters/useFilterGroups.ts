import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  changeDisplayedGroupFilter,
  changeLandingGroupsTab,
  GroupsFilter,
} from "../../store/slices/groups/GroupsSlice";
import React, { SetStateAction, useEffect, useState } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { chunkGroupsIntoPages } from "../../utils/helpers/chunk/chunkGroupsIntoPages";

type FilterGroupsHook = {
  setFilter: React.Dispatch<SetStateAction<GroupsFilter>>;
};

export const useFilterGroups = (): FilterGroupsHook => {
  const [filter, setFilter] = useState<GroupsFilter>("all");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeFilterGroups = async () => {
      const displayAllGroups = async () => {
        dispatch(changeDisplayedGroupFilter("all"));

        dispatch(changeLandingGroupsTab({ status: "pending" }));

        const groups = await trpcClient.groups.list.mutate();

        const all = chunkGroupsIntoPages(groups);

        dispatch(changeLandingGroupsTab({ status: "ready", data: all }));
      };

      const displayPopularGroups = async () => {
        dispatch(changeDisplayedGroupFilter("popular"));
        dispatch(changeLandingGroupsTab({ status: "pending" }));

        const popularGroups = await trpcClient.groups.popularGroups.mutate();

        const popular = chunkGroupsIntoPages(popularGroups);

        dispatch(changeLandingGroupsTab({ status: "ready", data: popular }));
      };

      switch (filter) {
        case "all": {
          await displayAllGroups();
          return;
        }
        case "popular": {
          await displayPopularGroups();
          return;
        }
      }
    };

    void executeFilterGroups();
  }, [filter]);

  return {
    setFilter,
  };
};
