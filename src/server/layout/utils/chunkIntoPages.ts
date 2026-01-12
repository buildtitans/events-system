import { EventsArraySchemaType } from "@/src/schemas/eventSchema";

function chunkEventsIntoPages(
    events: EventsArraySchemaType,
    maxPageLength: number = 6
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