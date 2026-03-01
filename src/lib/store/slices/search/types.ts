import type { EventSchemaType } from "@/src/schemas/events/eventSchema";

export type EventLookupMap = Record<
  EventSchemaType["title"],
  EventSchemaType["id"]
>;

export type SearchLookupType =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: EventLookupMap }
  | { status: "failed"; error: string }
  | { status: "n/a"; message: "Couldn't find events lookup for autocomplete" };
