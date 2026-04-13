import type { GroupsFilter } from "@/src/lib/store/slices/groups/types";

export type FilterOption = {
  value: GroupsFilter;
  label: string;
};

export function createGroupFilterPendingMessage(
  filter: GroupsFilter,
  options: FilterOption[],
) {
  const active = options.find((opt) => opt.value === filter) as FilterOption;
  return `Getting ${active.label}`;
}
