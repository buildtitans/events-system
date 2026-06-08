"use client";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useMemo } from "react";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import { getNumColumns } from "../../utils/rendering/getNumColumns";
import {
  seedCategoryMap,
  type CategoryMap,
} from "../../utils/rendering/seedCategoryMap";

const useGroupPages = (groupsPages: GroupsSchemaType[]) => {
  const categories = useSelector((s: RootState) => s.categories.categories);
  const currentPage = useSelector((s: RootState) => s.groups.currentPage);
  const page = groupsPages[currentPage] ?? [];
  const columns = getNumColumns(page.length);
  const categoryMap: CategoryMap = useMemo(() => {
    const map = seedCategoryMap(categories);
    return map;
  }, [categories]);

  return { currentPage, columns, categoryMap, groupsPages };
};

export { useGroupPages };
