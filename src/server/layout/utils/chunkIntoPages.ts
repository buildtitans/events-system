import { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
import type { EventsPages } from "../../../lib/types/types";
import { EventsArraySchemaType } from "@/src/schemas/eventSchema";

function chunkEventsIntoPages(
    events: EventsArraySchemaType,
    maxPageLength: number = 5
): EventsArraySchemaType[] {

    const pages: EventsArraySchemaType[] = [];

    for (let i = 0; i < events.length; i += maxPageLength) {
        pages.push(
            events.slice(
                i,
                i + maxPageLength
            )
        );
    }
    return pages;
}

export { chunkEventsIntoPages };