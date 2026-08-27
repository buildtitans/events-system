import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useCallback, useState } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { chunkGroupsIntoPages } from "../../utils/helpers/chunk/chunkGroupsIntoPages";
import {
  GroupFilterArgs,
  GroupFilterService,
} from "@/src/lib/store/services/filter/groupFilterService";
import { logCaughtError } from "../../utils/errors/logCaughtError";
import type { GroupFilterOptions } from "@/src/lib/tokens/categoryTokens";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import {
  enqueueDrawer,
  updateGroupsDisplayed,
} from "../../store/slices/rendering/RenderingSlice";
const filterService = new GroupFilterService(trpcClient);

type FilterGroupsHook = {
  selectCategoryToFilter: (categoryID: string) => void;
  selectFilter: (filterArgs: GroupFilterOptions) => void;
  applyFilter: () => Promise<void>;
  filterArgs: GroupFilterOptions;
};

export const useFilterGroups = (): FilterGroupsHook => {
  const [filterArgs, setFilterArgs] = useState<GroupFilterOptions>({
    filter: "all",
    label: "All Groups",
  });
  const [categorySelected, setCategorySelected] =
    useState<CategorySchemaType["id"]>("");
  const dispatch = useDispatch<AppDispatch>();

  const getFilterArgs = (): GroupFilterArgs => {
    switch (filterArgs.filter) {
      case "all": {
        return {
          filter: filterArgs.filter,
        };
      }
      case "popular": {
        return {
          filter: filterArgs.filter,
        };
      }
      case "category": {
        return {
          filter: filterArgs.filter,
          categoryId: categorySelected,
        };
      }
    }
  };

  const selectCategoryToFilter = useCallback(
    (categoryID: CategorySchemaType["id"]) => {
      setCategorySelected(categoryID);
    },
    [],
  );

  const applyFilter = async (): Promise<void> => {
    dispatch(updateGroupsDisplayed({ status: "pending" }));
    dispatch(enqueueDrawer(null));

    try {
      const groups = await filterService.filter(getFilterArgs());

      if (groups.length === 0) {
        dispatch(
          updateGroupsDisplayed({
            status: "n/a",
            message: "0 results for the applied filter",
          }),
        );
      } else {
        dispatch(
          updateGroupsDisplayed({
            status: "ready",
            data: chunkGroupsIntoPages(groups),
          }),
        );
      }
    } catch (err) {
      logCaughtError("useFilterGroups.applyFilter()", err);
      dispatch(
        updateGroupsDisplayed({
          status: "failed",
          error: "Failed to retrieve groups",
        }),
      );
    }
  };

  const selectFilter = useCallback((option: GroupFilterOptions) => {
    setFilterArgs(option);
  }, []);

  return {
    selectCategoryToFilter,
    selectFilter,
    applyFilter,
    filterArgs,
  };
};
