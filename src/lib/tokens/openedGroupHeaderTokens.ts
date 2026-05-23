import type { CurrentDisplay } from "@/src/lib/store/slices/groups/OpenedGroupSlice";

type HeaderInfo = {
  title: string;
  header: string;
  caption: string;
};

type CurrentDisplayedHeader = Record<CurrentDisplay, HeaderInfo>;

export const displayHeaders = {
  events: {
    title: "Schedule",
    header: "Current Schedule",
    caption: "Dates with markers show scheduled or previously held events.",
  },
  overview: {
    title: "Overview",
    header: "Community Snapshot",
    caption:
      "See the group's details, who runs it, and what activity is coming up.",
  },
  "group history": {
    title: "History",
    header: "Past Activity",
    caption:
      "Review previously held events and how many people attended each one.",
  },
  archives: {
    title: "Archives",
    header: "Archived Events",
    caption:
      "Browse cancelled events for review, coordination with group members, or rescheduling.",
  },
} satisfies CurrentDisplayedHeader;

export function getDisplayedHeader(displayed: CurrentDisplay) {
  return displayHeaders[displayed];
}

export type { HeaderInfo, CurrentDisplayedHeader };
