import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

export type PopularEventsIds = EventSchemaType["id"][];
type AttendantsCountMap = Map<EventSchemaType["id"], number>;

const MIN_POPULAR = 1;

function getIdsFromMap(
    map: AttendantsCountMap
): PopularEventsIds {
    const popularEvents: PopularEventsIds = [];

    for (const [event_id, count] of map) {
        if (count >= MIN_POPULAR) popularEvents.push(event_id);
    };
    return popularEvents
};

function countAttendants(
    map: AttendantsCountMap,
    status: EventAttendantsSchemaType["status"],
    event_id: EventSchemaType["id"]
): void {
    if (status === "going" || status === "interested") {
        map.set(event_id, (map.get(event_id) ?? 0) + 1)
    }
};

function curatePopularEventsIds(
    allAttendants: EventAttendantsSchemaType[]
): PopularEventsIds {
    const map: AttendantsCountMap = new Map();

    for (let i = 0; i < allAttendants.length; i++) {

        const event_id = allAttendants[i].event_id;
        const status = allAttendants[i].status;
        countAttendants(map, status, event_id);
    };

    return getIdsFromMap(map);
};

export { curatePopularEventsIds };