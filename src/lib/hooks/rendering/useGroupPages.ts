"use client";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import { getNumColumns } from "../../utils/rendering/getNumColumns";

const useGroupPages = (groupsPages: GroupDiscoverySummarySchemaType[][]) => {
  const currentPage = useSelector((s: RootState) => s.groups.currentPage);
  const page = groupsPages[currentPage] ?? [];
  const columns = getNumColumns(page.length);

  return { currentPage, columns, groupsPages };
};

export { useGroupPages };
