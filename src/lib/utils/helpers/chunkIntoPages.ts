import { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
import type { EventsPages } from "../../types/types";

function chunkEventsIntoPages(
    events: LayoutSlotSchemaType[],
    maxPageLength: number = 5
): EventsPages {

    const pages: LayoutSlotSchemaType[][] = [];

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