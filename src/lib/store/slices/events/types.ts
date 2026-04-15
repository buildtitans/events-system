import { AsyncState } from "@/src/lib/types/state/types";
import type { LayoutSlotSchemaType } from "@/src/schemas/events/layoutSlotSchema";

export type EventDisplayFilter =
  | "All Events"
  | "Popular Events"
  | "Upcoming events"
  | "Local events"
  | "Tech Events";

export type GroupNameByGroupID = Record<string, string>;

export type EventsPages = Array<LayoutSlotSchemaType[]>;

export type EventsStateType = AsyncState<EventsPages, "No events found">;
