import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

type PopularEventsIds = EventSchemaType["id"][];

function curatePopularEventsIds(allAttendants: EventAttendantsSchemaType[]) {
    const map: Map<string, number> = new Map();

    for (let i = 0; i < allAttendants.length; i++) {

        let event_id = allAttendants[i].event_id;

        map.set(event_id, (map.get(event_id) ?? 0) + 1)
    }

    const popularEvents: PopularEventsIds = []

    for (const [event_id, count] of map) {

        if (count >= 1) {
            popularEvents.push(event_id)
        }
    }

    return popularEvents
};

export { curatePopularEventsIds };