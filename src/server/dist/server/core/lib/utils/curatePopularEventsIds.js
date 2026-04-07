"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curatePopularEventsIds = curatePopularEventsIds;
const MIN_POPULAR = 1;
function getIdsFromMap(map) {
    const popularEvents = [];
    for (const [event_id, count] of map) {
        if (count >= MIN_POPULAR)
            popularEvents.push(event_id);
    }
    return popularEvents;
}
function countAttendants(map, status, event_id) {
    if (status === "going" || status === "interested") {
        map.set(event_id, (map.get(event_id) ?? 0) + 1);
    }
}
function curatePopularEventsIds(allAttendants) {
    const map = new Map();
    for (let i = 0; i < allAttendants.length; i++) {
        const event_id = allAttendants[i].event_id;
        const status = allAttendants[i].status;
        countAttendants(map, status, event_id);
    }
    return getIdsFromMap(map);
}
//# sourceMappingURL=curatePopularEventsIds.js.map