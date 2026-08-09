import type { GroupFilterOptions } from "@/src/lib/tokens/categoryTokens";

export function createGroupFilterPendingMessage(filter: GroupFilterOptions) {
  return `Getting ${filter.filter} groups`;
}
