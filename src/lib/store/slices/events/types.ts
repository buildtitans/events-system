import type { LayoutSlotSchemaType } from "@/src/schemas/events/layoutSlotSchema";

export type PresentedCategory = 'All Events'
    | 'Popular Events'
    | 'Upcoming events'
    | "Local events"
    | "Tech Events";

export type GroupNameByGroupID = Record<string, string>;

export type EventsPages = Array<LayoutSlotSchemaType[]>;

export type EventsDomainType = { status: "initial" }
    | { status: "pending" }
    | { status: "ready", data: EventsPages }
    | { status: "n/a", message: "No events found" }
    | { status: "failed", error: string };