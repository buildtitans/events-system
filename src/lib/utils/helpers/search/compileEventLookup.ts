import type { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";
import type { EventLookupMap } from "@/src/lib/store/slices/search/types";

export function compileEventLookup(events: EventsArraySchemaType) {
  const lookup: EventLookupMap = {};

  for (const event of events) {
    const title = event.title;
    const event_id = event.id;
    lookup[title] = event_id;
  }

  console.log({
    "Compiled Lookup": lookup,
  });

  return lookup;
}
